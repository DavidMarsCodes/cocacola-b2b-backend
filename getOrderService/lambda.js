module.exports = ({ accessControl, repositories, experts, res }) => ({

  /** Returns a customer's orders.
     * @param  {object} event
     */
  getOrder: async event => {
    let Order;
    let closeConnection;

    try {
      ({ Order, closeConnection } = await repositories());

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      experts.order.validateGetOrder(event);

      const { offset, limit } = experts.order.validPaginationParams(event.offset, event.limit, 0, 7);

      const data = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
      };

      const orders = await Order.get(data, offset, limit);

      experts.order.validateExistsResult(orders.data);

      const pagination = {
        currentpage: orders.currentPage,
        count: orders.count,
        offset,
        limit,
      };

      return res.success(orders.data, 200, pagination);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      const err = experts.order.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    } finally {
      await closeConnection();
    }
  },
});
