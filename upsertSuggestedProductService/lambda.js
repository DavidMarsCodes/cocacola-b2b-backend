module.exports = ({ awsRepositories, repositories, getTableName, experts, res, buildSuggestedProductObject }) => ({
  insertSuggestedProducts: async event => {

    let SuggestedProduct, Client, Product, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;
      ({ SuggestedProduct, Client, Product, closeConnection } = await repositories());

      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        organizationId: dynamoData.Item.organizationId,
        countryId: dynamoData.Item.countryId,
      };

      const statusArray = [];
      let failedObject = {};

      const suggestedProductGroupByClient = buildSuggestedProductObject(dynamoData.Item.data);

      for (const erpClientId in suggestedProductGroupByClient) {
        const clientData = await Client.getByErpId(erpClientId, erpParams);
        experts.client.validateExistsResult(clientData);

        erpParams.clientId = clientData.client.clientId;

        await SuggestedProduct.deleteByClient(erpParams);

        for (const suggestedProd of suggestedProductGroupByClient[erpClientId])
          try {
            experts.product.validateSuggestedProductItem(suggestedProd);

            const productData = await Product.getByErpId(suggestedProd.erpProductId, erpParams);
            experts.product.validateExistsResult(productData);

            erpParams.productId = productData.productId;

            await SuggestedProduct.create(suggestedProd, erpParams);

            failedObject = { ...suggestedProd };

            failedObject.message = 'Success';
            failedObject.operationStatus = 'Ok';

            statusArray.push(failedObject);
            const createdTime = new Date().toISOString();

            await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });

          } catch (e) {
            failedObject = { ...suggestedProd };

            if (e.customError) {
              const error = e.getData();

              failedObject.message = error.msg;
            } else
              failedObject.message = e.msg ? e.msg : 'ERROR';


            failedObject.operationStatus = 'Failed';

            statusArray.push(failedObject);
            const createdTime = new Date().toISOString();

            await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });
          }

      }

      return res.sendStatus(201);

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