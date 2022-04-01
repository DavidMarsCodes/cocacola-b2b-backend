module.exports = ({ repositories, getErpConfig, erpManager, operations, lodash, res }) => ({

  /** Description.
     * @param  {object} event
     */
  erpCreateBatchOrder: async event => {
    let Order;
    let OrderLog;
    let closeConnection;

    try {
      // Get instance of our schemas.
      ({ Order, OrderLog, closeConnection } = await repositories());

      // Get configurations from our ERP.
      const erpConfig = await getErpConfig();

      // Get order by id and status of the order created.
      const orders = await Order.getByStatus();

      // Validate if there are orders to process.
      if (lodash.isEmpty(orders)) return;

      // Setear configuración.
      erpManager.updateConfig(erpConfig);

      // Transacción.
      await operations.transactions(erpManager, Order, OrderLog, orders);

      // Response.
      return res.sendStatus(200);

    } catch (err) {
      console.error(err);

      if (err.customError) {
        const error = err.getData();
        error.msg = `No orders were found matching failed status or created.`;
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});
