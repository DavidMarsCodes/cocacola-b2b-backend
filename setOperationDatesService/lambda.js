module.exports = (
  {
    accessControl,
    repositories,
    res,
    dbRedis,
    experts,
    awsRepositories,
    getTableName,
    lodash,
    luxon,
    strategies,
  }) => ({
  /** Description.
     * @param  {object} event
     */
  setOperationDates: async event => {
    let redis;
    let VisitPlan;
    let closeConnection;

    try {
      const { DateTime } = luxon;
      redis = await dbRedis();
      ({ VisitPlan, closeConnection } = await repositories());
      experts.visitPlan.validateSetOperationDates(event);
      const { tableName } = await getTableName();
      const { Repository } = awsRepositories;

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      experts.visitPlan.validateIsBefore(event.deliverydate);

      event.deliveryType = [ 'delivery', 'deliveryfrozen' ];

      const visitPlan = await VisitPlan.getByDate(event.deliverydate, event);
      experts.visitPlan.validateExistsDate(visitPlan);

      const data = { paramId: event.cpgId + '-' + event.countryId + '-' + event.organizationId };
      const parameters = await Repository.get(tableName, data);


      const operationDates = {
        pricesDate: experts.portfolio.priceDateByCountry(event, parameters.Item.params.DATE_FOR_OPERATIONS),
        ...visitPlan,
      };


      // TODO: debería moverse a un archivo de configuraciones.
      // const ttl = lodash.round(120 * 60); // ttl in seconds

      const now = DateTime.utc();
      const endDay = now.endOf('day');
      const ttl = endDay.diff(now, 'second').toObject().seconds;

      let opdates = await redis.operationDates.get(event, userName);

      const strategy = strategies.deliveryManagerStrategy(opdates);

      opdates = await strategy.deliveryManager({ opdates, event, operationDates, experts, visitPlan, parameters });

      await redis.operationDates.upsert(event, userName, opdates, lodash.round(ttl));

      return res.success({}, 201);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await redis.closeConnection();
      await closeConnection();
    }
  },
});
