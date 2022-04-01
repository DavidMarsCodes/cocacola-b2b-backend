module.exports = ({ awsRepositories, getTableName, experts, res }) => ({

  /** Stores the sent Shipping Price (s) in DynamoDB.
     * @param  {object} event
     */
  createShippingPrice: async event => {
    try {

      experts.product.validateUpsertShippingPrice(event);

      const { tableName } = await getTableName();

      const { Repository } = awsRepositories;
      await Repository.create(tableName, event);

      return res.sendStatus(201);
    } catch (e) {
      console.error(e);
      if (!e.customError)
        return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(e));

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    }
  },
});
