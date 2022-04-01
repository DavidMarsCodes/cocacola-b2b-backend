module.exports = ({ awsRepositories, repositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  upsertProductService: async event => {

    let Product, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;

      ({ Product, closeConnection } = await repositories());

      const dynamoData = await Repository.get(tableName, { transactionId: dynamoTransactionId });

      const erpParams = {
        cpgId: dynamoData.Item.cpgId,
        organizationId: dynamoData.Item.organizationId,
        countryId: dynamoData.Item.countryId,
      };

      const statusArray = [];
      let failedObject = {};

      for (const product of dynamoData.Item.data)
        try {
          experts.product.validateCreateProductDateItem(product);

          await Product.upsert(product, erpParams);

          failedObject = { ...product };

          failedObject.message = 'Success';
          failedObject.operationStatus = 'Ok';

          statusArray.push(failedObject);
          const createdTime = new Date().toISOString();

          await Repository.create(tableNameError, { transactionId: dynamoTransactionId, statusArray, createdTime });


        } catch (e) {
          failedObject = { ...product };

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
