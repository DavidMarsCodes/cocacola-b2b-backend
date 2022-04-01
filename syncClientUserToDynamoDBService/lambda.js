module.exports = ({ awsRepositories, getTableName, experts }) => ({

  /** Description.
     * @param  {object} event
     */
  syncClientUserToDynamoDBService: async event => {
    try {
      const data = { ...event };

      const { Repository } = awsRepositories;
      const { tableName } = await getTableName();

      experts.user.validateDataSyncClientUser(data);

      const userClientIdKey = `${data.email}-${data.clientId}`;

      switch (data.operationType) {
      case 'INSERT':
        await Repository.create(tableName, {
          userClientIdKey,
          email: data.email,
          clientId: data.clientId,
        });
        console.debug(`case INSERT into ${tableName}`, data);
        break;
      case 'DELETE':
        await Repository.remove(tableName, { userClientIdKey });
        console.debug(`case DELETE into ${tableName}`, data);
        break;
      default:
        console.debug('case default', data);
        break;
      }

      console.debug(data);
    } catch (e) {
      let objectError;
      if (e.customError) {
        const err = e.getData();
        objectError = {
          err,
          failedData: event,
        };
        console.error(objectError);
        return;
      }

      objectError = { failedData: event };

      console.error(e, objectError);
    }
  },
});
