module.exports = ({ awsRepositories, getTableName, experts, res }) => ({
  createClient: async event => {
    try {
      const data = { ...event };
      data.createdTime = new Date().toISOString();

      const { Repository } = awsRepositories;

      experts.client.validateUpsertClient(data);

      const { tableName } = await getTableName();

      await Repository.create(tableName, data);

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
