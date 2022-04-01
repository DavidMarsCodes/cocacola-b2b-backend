const util = require('util');

module.exports = ({ getErpConfig, erpManager, res, awsRepositories, getTableName, repositories, experts }) => ({

  /** Description.
     * @param  {object} event - input data
     * @returns {object} HttpStatus 201
     */
  erpClientCredit: async (event) => {

    let ClientUser;
    let closeConnection;

    try {
      console.debug('event: ', util.inspect(event, false, null, true));

      const eventCopy = event.Records[0].body;
      console.debug('Get Record Body comming from SQS: ', util.inspect(eventCopy, false, null, true));

      const eventToJSON = JSON.parse(eventCopy);
      console.debug('Parsing Sqs data to JSON: ', eventToJSON);

      // Get instance of our schemas.
      ({ ClientUser, closeConnection } = await repositories());

      // Get configurations from our ERP.
      const erpConfig = await getErpConfig();

      const clients = await ClientUser.getClientIdAndErpIdByUserName(eventToJSON.username);
      experts.client.validateExistsResult(clients);

      // get Repository for DynamoDB
      const { Repository } = awsRepositories;
      const { DYNAMODB_TABLE_NAME } = await getTableName();

      // Construye el JSON que va a guardar en la taba de DynamoDB
      const createdTime = new Date().toISOString();
      const dynamoClients = clients.map((item) => ({
        createdTime,
        id: `${eventToJSON.cpgId}-${eventToJSON.countryId}-${eventToJSON.organizationId}-${item.Client.erpClientId}`,
        clientId: item.Client.clientId,
        status: 'ACTIVE',
      }),
      );

      // Grabar flag indicando que se pidio la actualizacion de creditos de los clientes a SAP.
      await Repository.batchCreate(DYNAMODB_TABLE_NAME, dynamoClients);

      // Setear configuración.
      erpManager.updateConfig(erpConfig);

      // construyo el array para la request que SAP espera
      const erpClientIdList = clients.map((item) => ({
        cpgId: eventToJSON.cpgId,
        countryId: eventToJSON.countryId,
        organizationId: eventToJSON.organizationId,
        erpClientId: item.Client.erpClientId,
      }));

      // armo el object request final para SAP
      const requestErpBody = { erpClientIdList };

      // Enviar a SAP la Request.
      await erpManager.save(requestErpBody);

      // Response.
      return res.sendStatus(201);

    } catch (err) {
      console.error(err);

      if (err.customError) {
        const error = err.getData();
        error.msg = `No orders were found matching failed status or created.`;
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      closeConnection();
    }
  },
});
