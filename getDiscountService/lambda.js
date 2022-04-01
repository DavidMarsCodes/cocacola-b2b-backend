module.exports = (
  {
    accessControl,
    experts,
    res,
    dbRedis,
    discountsHandler,
    repositories,
    awsRepositories,
    getTableName,
    inspect,
    rounding,
    taxes,
  }) => ({

  /** Description.
     * @param  {object} event
     */
  getDiscountService: async event => {
    const _delay = delay => new Promise(res => setTimeout(res, delay));

    const getData = async () => {
      let Order;
      let closeConnection;

      try {
        ({ Order, closeConnection } = await repositories());
        const { tableName } = await getTableName();
        const { Repository } = awsRepositories;
        await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
        const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

        const redis = await dbRedis();
        const operationDates = await redis.operationDates.get(event, userName);
        experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });
        const { pricesDate: priceDateByCountry, deliverydate } = operationDates;

        const hasDataLoaded = await redis.clientDataLoaded.get(event);
        event.deliverydate = deliverydate;

        experts.discount.validateDiscountGetAllRequiredParams(event);
        experts.discount.isValidDate(event.deliverydate);
        experts.order.hasDataLoaded(hasDataLoaded);

        const data = { paramId: `${event.cpgId}-${event.countryId}-${event.organizationId}` };
        const decimalPrecision = await Repository.get(tableName, data);

        const rawDiscountData = await redis.clientDiscount.get(event);
        const clientDiscounts = discountsHandler.processDiscounts(rawDiscountData, priceDateByCountry, false);
        experts.discount.validateExistsResult(clientDiscounts);

        const recalculatedTaxesDiscount = await taxes.calculateDiscountTaxes(clientDiscounts, Order, event.clientId, priceDateByCountry);

        rounding.discount.applyRounds(recalculatedTaxesDiscount, decimalPrecision.Item.params.ROUND_PRESICION);

        return res.success(recalculatedTaxesDiscount, 200);
      } catch (e) {
        console.error(e);
        if (e.customError) {
          const err = e.getData();
          return res.error(err.msg, err.code, err.type, err.httpStatus);
        }
        return res.error('internal_server_error', 0, 'Server_Error', 500);
      } finally {
        await closeConnection();
      }
    };

    return getData();
  },
});
