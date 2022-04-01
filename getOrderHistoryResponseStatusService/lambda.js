module.exports = ({ awsRepositories, getTableName, getErpConfig, erpManager, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getOrderHistory: async event => {
    try {
      // Get the transactionId.
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

    } catch (error) {
      console.error(error);
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(error));
    }
  },

});