module.exports = ({ repositories, experts, res, awsConfig, getEncryption, handlerErrorCode, Cognito, awsRepositories, uuid }) => ({

  /** login external user to b2b.
     * @param  {object} event - input data
     * @returns {uuid} uuid
     */
  userLoginService: async (event) => {
    let User;
    let closeConnection;
    let Client;

    try {
      console.debug(event);

      ({ User, Client, closeConnection } = await repositories());

      // Validate required parameters.
      experts.user.validateUserLogin(event);

      // Validate if user exists
      const user = await User.getUserByEmailOrPhoneAndTenant(event);
      experts.user.validateLoginFoundUser(user);

      // get clientId by erpClientId (manejo de sucursales)
      const clientB2B = await Client.getClientIdByErpId(event.erpClientId, event);
      experts.client.validateExistsResult(clientB2B);

      const { getSecretEncryptionKey, getCognitoInfo } = awsConfig;

      // Decrypt data.
      const { key } = await getSecretEncryptionKey();
      const decritedPassword = getEncryption('MCC').decrypt(event.password, key);

      const cognito = new Cognito;
      const { USER_POOL_ID, CLIENT_ID, DYNAMODB_TABLE_NAME } = await getCognitoInfo();

      // get username for adminInitiateAuth parameter.
      const cognitoUser = await cognito.adminGetUser({
        Username: event.email,
        UserPoolId: USER_POOL_ID,
      });

      // get jwtTokens, TokenType and expiresIn.
      const authenticationResult = await cognito.adminInitiateAuth({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: cognitoUser.Username,
          PASSWORD: decritedPassword,
        },
      });

      const { Repository } = awsRepositories;

      // Saving returned data from adminInitiateAuth to DynamoDB.
      const savedData = await Repository.create(DYNAMODB_TABLE_NAME, {
        id: uuid.v4(),
        AccessToken: authenticationResult.AuthenticationResult.AccessToken,
        ExpiresIn: authenticationResult.AuthenticationResult.ExpiresIn,
        TokenType: authenticationResult.AuthenticationResult.TokenType,
        RefreshToken: authenticationResult.AuthenticationResult.RefreshToken,
        IdToken: authenticationResult.AuthenticationResult.IdToken,
        username: user.username,
        countryId: user.countryId,
        clientId: clientB2B.clientId,
      });

      return res.status(200).json({ id: savedData.Item.id });

    } catch (e) {
      console.error(e);

      if (e.customError) {
        let error = e.getData();
        error = handlerErrorCode.resetCode(error);
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      if (e.name) {
        const error = handlerErrorCode.resetCode(e);
        return res.error(error.message, error.code, error.name, 400);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      closeConnection();
    }
  },
});
