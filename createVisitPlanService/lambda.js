module.exports = ({ awsRepositories, getTableName, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  createVisitPlan: async event => {

    try {
      const data = { ...event };
      data.createdTime = new Date().toISOString();

      experts.visitPlan.validatecreateVisitPlan(data);

      const { tableName } = await getTableName();

      const { Repository } = awsRepositories;
      await Repository.create(tableName, data);

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