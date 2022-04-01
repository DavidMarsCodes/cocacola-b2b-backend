module.exports = ({ awsRepositories, getTableName, getErpConfig, erpManager, res }) => ({

  getShippingPriceResponseStatus: async event => {
    try {
      // Se utiliza la primer posición de Records porque se genera un transactionId por envío de SAP.
      // Se utiliza "transactionId.S" ya que DynamoDB agrega al objeto el tipo de dato. En este caso un String.
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;

      // Get the name of the table to query.
      const { tableNameError } = await getTableName();

      // Get information.
      const { Repository } = awsRepositories;
      const result = await Repository.get(tableNameError, { transactionId: dynamoTransactionId });
      const data = result.Item || {};

      // Get configurations from our ERP.
      const erpConfig = await getErpConfig();

      // Set configuration.
      erpManager.updateConfig(erpConfig);

      // Send data to an external system.
      await erpManager.save(data);

    } catch (e) {
      console.error(e);
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(e));
    }
  },
});
