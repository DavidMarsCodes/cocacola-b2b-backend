module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event input dynamo trigger
     * @return {object} status code
     */
  upsertCreditLimitService: async (event) => {
    let CreditLimit, Client, Segment, closeConnection;

    try {
      // Obtenemos el TransactionId del event trigger
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;

      // Creamos las insatancias de los repositorios requeridos.
      const { Repository } = awsRepositories;
      ({ CreditLimit, Client, Segment, closeConnection } = await repositories());
      const { DYNAMODB_TABLE_NAME, DYNAMODB_TABLE_NAME_ERRORS, DYNAMODB_TABLE_NAME_FLAGS } = await getTableName();

      // Traer los datos almacenados de clientes que queremos actualizar.
      const dynamoData = await Repository.get(DYNAMODB_TABLE_NAME, { transactionId: dynamoTransactionId });

      // Validar datos requeridos.
      experts.creditLimit.validateUpsertCreditLimit(dynamoData.Item);

      // Armamos objeto con los parametros necesarios para crear registros en tabla.
      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        countryId: dynamoData.Item.countryId,
        organizationId: dynamoData.Item.organizationId,
      };

      // Creamos un array donde vamos a almacenar los estados de los resultados de las operaciones.
      const statusArray = [];
      let creditLimitData = {};

      // Recorremos las listas de clients de cada ERP.
      for (const item of dynamoData.Item.data) {
        try {
          creditLimitData = {
            ...erpParams,
            ...item,
          };
          console.debug('Data comming from DynamoDB: ', creditLimitData);

          // Validar datos requeridos dentro de items.
          experts.creditLimit.validateUpsertItemCreditLimitData(creditLimitData);

          const client = await Client.getClientIdByErpId(item.erpClientId, erpParams);
          experts.client.validateExistsResult(client);
          creditLimitData.clientId = client.clientId;

          const segment = await Segment.getSegmentIdByErpId(item.erpSegmentId, erpParams);
          experts.segment.validateExistsResult(segment);
          creditLimitData.segmentId = segment.segmentId;

          const creditLimit = await CreditLimit.getByAvailable(creditLimitData);

          if (creditLimit === null) {
            console.info(`ClientCredit does not exist, creating...`);
            await CreditLimit.upsert(creditLimitData);
          } else if (item.available !== parseFloat(creditLimit.available)) {
            console.info(`Credit Limit updated for client: ${creditLimitData.clientId}`);
            await CreditLimit.upsert(creditLimitData);
          }

          const failedObject = { ...item };

          failedObject.operationStatus = 'Ok';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(DYNAMODB_TABLE_NAME_ERRORS, {
            transactionId: dynamoTransactionId,
            statusArray,
            createdTime,
          });

          await Repository.create(DYNAMODB_TABLE_NAME_FLAGS, {
            createdTime,
            id: `${erpParams.cpgId}-${erpParams.countryId}-${erpParams.organizationId}-${item.erpClientId}`,
            clientId: creditLimitData.clientId,
            status: 'PROCESSED',
          });

        } catch (e) {
          console.error(e);
          const failedObject = { ...item };

          failedObject.message = e.msg ? e.msg : 'ERROR';
          failedObject.operationStatus = 'Failed';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(DYNAMODB_TABLE_NAME_ERRORS, {
            transactionId: dynamoTransactionId,
            statusArray,
            createdTime,
          });
        }
      }

      return res.sendStatus(201);

    } catch (e) {
      console.error(e);
      if (!e.customError) {
        return res.error('internal_server_error', 0, 'server_error', 500);
      }

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }
  },

});
