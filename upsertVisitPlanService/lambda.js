module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  upsertVisitPlan: async event => {

    let VisitPlan, Client, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;
      ({ VisitPlan, Client, closeConnection } = await repositories());

      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        organizationId: dynamoData.Item.organizationId,
        countryId: dynamoData.Item.countryId,
      };

      const statusArray = [];

      for (const visitPlanItem of dynamoData.Item.data)
        try {
          const existingClient = await Client.getByErpId(visitPlanItem.erpClientId, erpParams);
          experts.client.validateExistsResult(existingClient);

          // Armamos el objeto con la data para actualizar o crear en MySQL
          const visitPlanData = {
            clientId: existingClient.client.clientId,
            route: visitPlanItem.erpRouteId,
            ...visitPlanItem,
            ...erpParams,
          };

          delete visitPlanData.erpClientId;
          delete visitPlanData.erpRouteId;

          await VisitPlan.upsert(visitPlanData);

          const transactionResult = { ...visitPlanItem };

          transactionResult.operationStatus = 'Ok';

          statusArray.push(transactionResult);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });

        } catch (e) {
          const transactionFailedResult = { ...visitPlanItem };

          transactionFailedResult.message = e.msg ? e.msg : 'ERROR';
          transactionFailedResult.operationStatus = 'Failed';

          statusArray.push(transactionFailedResult);
        }


      const createdTime = new Date().toISOString();
      if (statusArray.length != 0) await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });


    } catch (e) {
      console.error(e);
      if (!e.customError)
        return res.error('internal_server_error', 0, 'server_error', 500);

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }

  },

});
