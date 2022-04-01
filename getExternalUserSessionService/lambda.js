module.exports = ({ awsRepositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event
     * @returns {object} response - containing users session data like JWT tokens
     */
  getExternalUserSession: async event => {
    try {
      console.debug(event);
      // Get the name of the table to query.
      const { tableName } = await getTableName();

      // Get information and delete registry from dynamo
      const { Repository } = awsRepositories;
      const result = await Repository.remove(tableName, { id: event.userId });
      console.debug(result);
      const data = result.Attributes;

      experts.user.validateFoundUser(data);

      return res.success(data, 200);
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