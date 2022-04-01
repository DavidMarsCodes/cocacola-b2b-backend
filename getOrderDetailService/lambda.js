module.exports = ({ accessControl, repositories, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getOrderDetailService: async event => {
    let Order;
    let closeConnection;

    try {
      ({ Order, closeConnection } = await repositories());

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      const data = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        orderId: event.orderId,
        clientId: event.clientId,
      };

      const orderDetail = await Order.getDetailById(data);

      experts.order.validateExistsResult(orderDetail);

      return res.success(orderDetail, 200);

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
  },
});
