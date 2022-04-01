module.exports = ({ accessControl, repositories, experts, getErpConfig, erpManager, res, getInstanceQueue, uuid, sendToSQS }) => ({


  /**
   * @description Get the order from DynamoDB table,
   * for the cancellation of an order the available statuses are
   * INITIATED, CREATED, DELIVERED, REGISTERED
   * otherwise you can't cancel.
   * for only DELIVERED, REGISTERED status we send it to SAP.
   * finally we save it to DynamoDB table where we got
   * the order and return response.
   * @param {object} event - input data.
   * @returns {object} res - return HttpStatus.
   */
  cancellationOrderService: async (event) => {

    console.debug('event: ', event);

    let Order;

    try {
      ({ Order } = await repositories());
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      const { email } = await accessControl.getSessionData(event.b2bSession.Authorization);

      const createdAt = new Date().toISOString();

      const { status, erpOrderId } = await Order.getById(event);

      try {
        experts.order.validateIsCancellableOrder(status);
      } catch (error) {
        console.error(`orderId: ${event.orderId} status: ${status}, is not valid. Cannot be cancelled`);
        throw error;
      }

      if (status.includes('DELIVERED', 'REGISTERED')) {

        // Get configurations from our ERP.
        const erpConfig = await getErpConfig();

        // Setear configuración.
        erpManager.updateConfig(erpConfig);

        // armo el object request final para SAP
        const requestErpBody = {
          cpgId: event.cpgId,
          countryId: event.countryId,
          organizationId: event.organizationId,
          orderId: event.orderId,
          erpOrderId,
          user: email,
          createdAt,
        };

        console.debug('requestErpBody: ', requestErpBody);

        // Enviar a SAP la Request.
        await erpManager.save(requestErpBody);

        Order.updateStatus(event, 'CANCELLATION REQUEST');

      } else {
        Order.updateStatus(event, 'CANCELLED');

        await sendToSQS(getInstanceQueue, uuid, event);
      }

      // Response.
      return res.sendStatus(201);

    } catch (err) {
      console.error(err);

      if (err.customError) {
        const error = err.getData();
        error.msg = `No orders were found matching failed status or created.`;
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    }
  },
});
