module.exports = ({ awsRepositories, orderItemDetailTable, lodash, Mapper, log, errEvent, enabledStates }) => ({

  transactions: async (erpManager, Order, OrderLog, orders) => {

    for (const order of orders) {
      let erpOrder;
      try {
        // Get Repositories
        const { Repository } = awsRepositories;

        // Get Discount
        const orderItemDetail = await Repository.get(orderItemDetailTable, { orderId: order.orderId.toString() });
        const discountsData = !lodash.isEmpty(orderItemDetail) ? orderItemDetail.Item : [];

        // transform BOM discount to orderItem
        Mapper.bomMap(order, discountsData.calculatedItems);

        // Build array of discounts.
        const discounts = Mapper.discountMap(order.orderId, discountsData);

        // Build array of orderItems.
        const orderItems = Mapper.orderItemMap(order.items);

        // Build array of orderDelivery
        const orderDelivery = Mapper.orderDeliveryMap(order.orderDelivery);

        // Build order to send to ERP.
        erpOrder = Mapper.orderMap(order, orderItems, discounts, orderDelivery);

        // Send order to an external system.
        const res = await erpManager.save(erpOrder);

        // Information log.
        log.info(erpOrder, res);

      } catch (err) {
        console.error(err);

        // Error handler.
        const error = errEvent.handler(err, order);

        // Change order status from created to delivered.
        await Order.updateStatus(order, enabledStates.failed);

        // Create a record in the OrderLog entity.
        await log.create(OrderLog, order, enabledStates.error, error);

        console.info('Error shipping Order:', erpOrder || '');
        console.error(error);
        continue;
      }

      // Change order status from created to delivered.
      await Order.updateStatus(order, enabledStates.delivered);

      // Create a record in the OrderLog entity.
      await log.create(OrderLog, order, enabledStates.success);
    }

  },

});