module.exports = ({ awsRepositories, getTableName, experts, res }) => ({
  createBasePrice: async event => {
    try {
      experts.basePrice.validateUpsertBasePrice(event);

      const { tableName } = await getTableName();

      const { Repository } = awsRepositories;
      await Repository.create(tableName, event);

      return res.sendStatus(201);
    } catch (e) {
      console.error(e);
      if (!e.customError)
        return res.error('internal_server_error', 0, 'server_error', 500);

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    }
  },
});
