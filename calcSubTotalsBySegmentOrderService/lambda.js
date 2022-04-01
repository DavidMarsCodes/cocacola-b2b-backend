module.exports = ({ accessControl, repositories, experts, res, dbRedis, awsRepositories, getTableNames, getSubTotalBySegments, creditCalculation }) => ({

  /**
   * @description Gets orders data from Redis (createPartialOrder result)
   * and process those items for get the
   * subtotals divided by segment and saves this
   * into a DynamoDB table, after that,
   * we do a check between subtotals and the available credit
   * finally we return it as response.
   * @param {object} event - input data.
   * @returns {object} res - return HttpStatus and json.
   */
  calcSubTotalsBySegmentOrder: async (event) => {
    let CreditLimit;

    try {
      ({ CreditLimit } = await repositories());
      const redis = await dbRedis();

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      let redisItems;
      // obtengo los items del pedido
      if (event.orderId) {
        redisItems = await redis.order.get(event, event.orderId);
        console.debug('redisItems ', redisItems);
        redis.closeConnection();
      }

      const hasRedisItems = redisItems || [];

      const creditLimitData = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
      };

      const availableBySegments = await CreditLimit.getAvailablesBySegmentIdAndName(creditLimitData);
      console.info('availableBySegments: ', availableBySegments);

      const { DYNAMODB_TABLE_NAME } = await getTableNames();
      const { Repository } = awsRepositories;

      const accumulatedBySegments = await getSubTotalBySegments(hasRedisItems);
      console.debug('accumulatedBySegments: ', accumulatedBySegments);

      await Repository.create(DYNAMODB_TABLE_NAME, {
        id: `${event.cpgId}-${event.countryId}-${event.organizationId}-${event.orderId}-${event.clientId}`,
        accumulatedBySegments,
      });

      const paymentHandlerResult = await creditCalculation(availableBySegments, accumulatedBySegments);
      console.debug('paymentHandlerResult :', paymentHandlerResult);

      return res.status(200).json({ paymentHandlerResult });
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      const err = experts.order.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    }
  },

});