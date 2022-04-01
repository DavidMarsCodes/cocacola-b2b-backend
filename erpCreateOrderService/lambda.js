module.exports = ({ repositories, getErpConfig, erpManager, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  erpCreateOrder: async event => {
    let Order;
    let OrderLog;
    let closeConnection;

    try {
      // Get instance of our schemas.
      ({ Order, OrderLog, closeConnection } = await repositories());
      // Get configurations from our ERP.
      const erpConfig = await getErpConfig();

      // Get order by id and status of the order created.
      const order = await Order.getByIdAndStatus(event);

      // Check that there is an order.
      experts.order.validateExistsResult(order);

      try {
        // Send request to an external system.
        erpManager.updateConfig(erpConfig);
        await erpManager.save(order);

      } catch (err) {
        let error = {
          meta: err.toJSON(),
          code: err.code,
          message: err.message,
          orderId: event.orderId,
        };

        // Identify the type of error.
        if (err.code === 'ECONNABORTED')
          error = {
            code: 'ECONNABORTED',
            timeOut: true,
            message: 'The  conection time out expired.',
            meta: err.toJSON(),
            orderId: event.orderId,
          };


        // Change order status from created to failed.
        await Order.updateStatus(event, 'failed');

        // Create objet log
        const log = {
          ...event,
          eventType: 'FIRST',
          eventResult: 'ERROR',
          eventInfo: error.message,
        };

        // Create a record in the OrderLog entity.
        await OrderLog.create(log);

        throw error;
      }

      // Change order status from created to delivered.
      await Order.updateStatus(event, 'delivered');

      // Create objet log
      const log = {
        ...event,
        eventType: 'FIRST',
        eventResult: 'OK',
        eventInfo: `The operation has been successful. The order data was sent with id ${event.orderId}.`,
      };

      // Create a record in the OrderLog entity.
      await OrderLog.create(log);

      return res.sendStatus(202);

    } catch (err) {
      console.error(err);

      if (err.customError) {
        const error = err.getData();
        error.msg = `An order was not found that matches the orderId ${event.orderId} and the CREATED state.`;
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      if (err.meta)
        return res.error(err.meta.message, 5010, 'order_error', 400);


      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      closeConnection();
    }
  },
});
