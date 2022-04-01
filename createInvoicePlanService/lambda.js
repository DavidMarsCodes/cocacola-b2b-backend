module.exports = ({ awsRepositories, getTableName, experts, res }) => ({

  /** Stores the sent Invoice Plan (s) in DynamoDB.
     * @param  {object} event
     */
  createInvoicePlan: async event => {

    try {
      experts.invoicePlan.validateRequiredParamsCreateInvoicePlan(event);

      const { tableName } = await getTableName();

      const { Repository } = awsRepositories;
      await Repository.create(tableName, event);

      return res.sendStatus(201);
    } catch (error) {
      console.error(error);
      if (error.customError) {
        const err = error.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(error));
    }

  },

});