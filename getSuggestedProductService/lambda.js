module.exports = ({ accessControl, repositories, experts, res, dbRedis }) => ({

  getSuggestedProduct: async event => {
    let SuggestedProduct;
    let closeConnection;
    let redis;

    try {
      ({ SuggestedProduct, closeConnection } = await repositories());

      redis = await dbRedis();

      // Control if the user is authorized to access the resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      // Get session username.
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      const { offset, limit } = experts.suggestedProduct.validateSuggestedProductPaginationParams(event.offset, event.limit);
      experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams(event);

      // Get date from Redis.
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });
      const { pricesDate } = operationDates;

      const data = await SuggestedProduct.getByClientId(offset, limit, event.cpgId, event.countryId, event.organizationId, event.clientId, pricesDate);

      const pagination = {
        limit,
        offset,
        count: data.count,
        currentPage: data.currentPage,
      };

      return res.success(data.suggestedProduct, 200, pagination);

    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();

        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await closeConnection();
      redis.closeConnection();
    }
  },
});

