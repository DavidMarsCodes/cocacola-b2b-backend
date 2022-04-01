module.exports = ({ accessControl, repositories, experts, res }) => ({

  /** Get all discretionary discounts for a client.
     * @param  {object} event
     */
  getDiscretionaryDiscountService: async event => {
    let Discount;
    let closeConnection;

    try {
      ({ Discount, closeConnection } = await repositories());
      const { offset, limit } = experts.discount.validateDiscountPaginationParams(event.offset, event.limit);
      experts.discount.validateDiscountGetAllRequiredParams(event);
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      const filterDate = experts.discount.discretionaryDiscountDateFilter(event);
      const request = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
        filterDate,
      };
      const discretionaryDiscounts = await Discount.getDiscretionaryDiscountsByClient(request, offset, limit);
      experts.discount.validateExistsResult(discretionaryDiscounts);
      const pagination = {
        limit,
        offset,
        count: discretionaryDiscounts.count,
        currentPage: discretionaryDiscounts.currentPage,
      };
      return res.success(discretionaryDiscounts.discretionaryDiscounts, 200, pagination);

    } catch (exception) {
      console.error(exception);
      if (exception.customError) {
        const error = exception.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});
