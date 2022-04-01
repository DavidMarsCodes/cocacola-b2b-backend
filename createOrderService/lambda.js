module.exports = ({ repositories, experts, res }) => ({

  createOrder: async event => {
    let Order;
    let OrderItem;
    let closeConnection;

    try {
      ({ Order, OrderItem, closeConnection } = await repositories());

      experts.order.isValidRequiredData(event);

      experts.order.isValidDate(event.orderDeliveryDate);

      const orderDeliveryDate = experts.order.formatDate(event.orderDeliveryDate);
      event.orderDeliveryDate = orderDeliveryDate;

      // TODO: Async Validations

      const order = await Order.create(event);
      const items = await OrderItem.create(order);

      return res.status(201).json({ orderId: order.orderId, itemsCreated: items });

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
      closeConnection();
    }
  },

});