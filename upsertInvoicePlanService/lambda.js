module.exports = ({ respositories, awsRepositories, getTableName, experts, operations, res }) => ({

  /**
     * @param  {object} event
     */
  upsertInvoicePlan: async event => {

    let InvoiceDeadlinePlan, InvoiceDeadlinePlanItem, closeConnection;

    try {
      const dynamoTransactionId = event.Records[0].dynamodb.NewImage.transactionId.S;
      ({ InvoiceDeadlinePlan, InvoiceDeadlinePlanItem, closeConnection } = await respositories());

      const { tableName, tableNameError } = await getTableName();
      const { Repository } = awsRepositories;

      let data = await Repository.get(tableName, { transactionId: dynamoTransactionId });
      const erpParams = {
        cpgId: data.Item.cpgId,
        countryId: data.Item.countryId,
        organizationId: data.Item.organizationId,
      };

      data = data.Item.data;

      await operations.transactions(InvoiceDeadlinePlan, InvoiceDeadlinePlanItem, Repository, experts, tableNameError, dynamoTransactionId, data, erpParams);

      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(error));
    } finally {
      await closeConnection();
    }

  },

});