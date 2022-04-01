module.exports = ({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption }) => ({
  createUser: async event => {
    let User;
    let Client;
    let ClientUser;
    let ClientLock;
    let closeConnection;

    try {
      // get repos used in the function
      ({ User, Client, ClientUser, ClientLock, closeConnection } = await repositories());

      // Get crypto-js secret key
      const secretKey = await getSecretEncryption(event.sourceChannel);

      // Decrypt encrypted request data;
      const decryptStrategy = decrypt(event.sourceChannel);
      const decryptedData = decryptStrategy.decryptAll(event, secretKey.key);
      // crea un nuevo obj sobreescribiendo los datos encriptados del event con los desencriptados
      const userData = {
        ...event,
        ...decryptedData,
      };

      // Validate request fields
      experts.user.validateUserData(userData);

      const erpParams = {
        cpgId: userData.cpgId,
        countryId: userData.countryId,
        organizationId: userData.organizationId,
      };

      // Validate if Client exist
      const client = await Client.getByFiscalIdAndClientId(userData.client.erpClientId, userData.client.fiscalId, erpParams);
      // Obtener los clientes con el mismo FiscalId (CUIT, RUT, RUC, etc).
      const subsidiaries = await Client.getByFiscalId(userData.client.fiscalId, erpParams);

      if (!client)
        throw {
          msg: `Client don't exist`,
          code: 1100,
          type: 'client',
          httpStatus: 400,
          clientErr: true,
        };


      // Validar que el cliente este activo.
      if (client.deleted)
        throw {
          msg: `The client is not active.`,
          code: 1101,
          type: 'client',
          httpStatus: 400,
          clientErr: true,
        };


      // Validar que el cliente no tenga bloqueos para registrar nuevos usuarios lockSigin.
      const clientLock = await ClientLock.getLockSigIn(client, erpParams);
      if (!lodash.isEmpty(clientLock))
        throw {
          msg: `This client has locks of type lockSingIn.`,
          code: 1102,
          type: 'client',
          httpStatus: 400,
          clientErr: true,
        };


      // valido que no exista otro cliente con el mismo email o telefono
      const existingUser = await User.getUserByEmailOrPhone(userData);
      experts.user.checkIfUserExist(existingUser);

      const { cognito } = await initCognito(event.sourceChannel, AWS);
      try {
        // registramos el usuario (email) en cognito y obtenemos su username
        const usernameUUID = await cognito.signUp(userData.email, userData.cellphone, userData.password);
        userData.username = usernameUUID;
      } catch (err) {
        console.error(`Error registering user into Cognito - User data = cpg: ${ userData.cpgId } 
                        - countryId: ${ userData.countryId } 
                        - organizationId:  ${ userData.organizationId } 
                        - email: ${ userData.email } 
                        - Firstname: ${ userData.firstName } 
                        - Lastname: ${ userData.lastName }`, err);

        let errorCode = 2100;
        let errMessage = 'Cognito error';
        if (err.message === 'An account with the given email already exists.') {
          errorCode = 2001;
          errMessage = 'email_already_exists';
        }

        if (err.code === 'InvalidPasswordException') {
          errorCode = 2002;
          errMessage = 'password_invalid';
        }

        if (err.code === 'InvalidParameterException' && err.message.includes("'password'")) {
          errorCode = 2002;
          errMessage = 'password_invalid';
        }

        throw {
          msg: errMessage,
          code: errorCode,
          type: 'cognito',
          httpStatus: 400,
          cognitoErr: true,
        };
      }

      // creamos el usuario
      const user = await User.create(userData);

      const clientUserData = {
        cpgId: client.cpgId,
        countryId: client.countryId,
        organizationId: client.organizationId,
        clientId: client.clientId,
        userId: user.userId,
      };

      // Verificar el rol del clientUser y setear rol
      const existingClientUser = await ClientUser.get(client.clientId);
      clientUserData.rol = existingClientUser ? 'Buyer' : 'Administrator';

      // Crear clienteUser.
      await ClientUser.create(clientUserData);
      // Si tiene sucursales, creo la relación en clientUser.
      if (!lodash.isEmpty(subsidiaries.clients)) {
        console.info('Sucursales encontradas: ', subsidiaries.clients);
        for (const subsidiary of subsidiaries.clients)
          if (client.clientId !== subsidiary.clientId) {
            clientUserData.clientId = subsidiary.clientId;
            clientUserData.createdBy = 'AUTOMATIC';
            await ClientUser.create(clientUserData);
          }

      }

      const response = {...userData};
      delete response.password;
      delete response.b2bSession;

      return res.success(response, 201);

    } catch (e) {
      console.error('Error registering user: ', e);

      if (e.customError) {
        let error = e.getData();
        error = handlerErrorCode(error);
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      if (e.cognitoErr || e.clientErr)
        return res.error(e.msg, e.code, e.type, e.httpStatus);


      // Check if error was generated by response component
      if (e.message) {
        const errMsg = await JSON.parse(e.message);
        if (!lodash.isEmpty(errMsg.httpStatus) && !lodash.isEmpty(errMsg.code)
                        && !lodash.isEmpty(errMsg.errorType) && !lodash.isEmpty(errMsg.ok))
          return e;

      }

      const err = experts.user.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    } finally {
      closeConnection();
    }
  },

});