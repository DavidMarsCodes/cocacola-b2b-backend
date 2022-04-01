module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  upsertOrderHistory: async (event) => {

    let OrderHistory, Client, PaymentMethod, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;

      ({ OrderHistory, Client, PaymentMethod, closeConnection } = await repositories());

      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        organizationId: dynamoData.Item.organizationId,
        countryId: dynamoData.Item.countryId,
      };

      const statusArray = [];
      let failedObject = {};

      for (const orderHist of dynamoData.Item.data) {
        try {
          experts.orderHistory.validateorderHistoryItem(orderHist);

          orderHist.cpgId = erpParams.cpgId;
          orderHist.organizationId = erpParams.organizationId;
          orderHist.countryId = erpParams.countryId;

          const clientData = await Client.getByErpId(orderHist.erpClientId, erpParams);
          experts.client.validateExistsResult(clientData);
          orderHist.clientId = clientData.client.clientId;

          let paymentMethodData;
          if (orderHist.paymentMethod) {
            paymentMethodData = await PaymentMethod.getByErpId(orderHist.paymentMethod, erpParams);
          }

          orderHist.paymentMethodId = paymentMethodData ? paymentMethodData.paymentMethodId : null;

          await OrderHistory.upsert(orderHist);

          failedObject = { ...orderHist };

          failedObject.message = 'Success';
          failedObject.operationStatus = 'Ok';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });

        } catch (e) {
          console.error(e);
          failedObject = { ...orderHist };

          if (e.customError) {
            const error = e.getData();

            failedObject.message = error.msg;
          } else {
            failedObject.message = e.msg ? e.msg : 'ERROR';
          }



          failedObject.operationStatus = 'Failed';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });
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
