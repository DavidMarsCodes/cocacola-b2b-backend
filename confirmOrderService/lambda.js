const util = require('util');

module.exports = ({ accessControl, repositories, experts, res, dbRedis, getTableNames, awsRepositories, getInstanceQueue, uuid, sendToSQS }) => ({

  /**
   * @description
   * Gets orders data from Redis (createPartialOrder result)
   * then saves this data into a table also
   * gets the accumulated subTotals divided by segment from DynamoDB table
   * after that, send dynamoDB data to SQS
   * finally updates order status and send a response.
   * @param {object} event - input data.
   * @returns {object} res - return HttpStatus and json.
   */
  confirmOrder: async (event) => {
    let Order;
    let OrderItem;

    try {
      ({ Order, OrderItem } = await repositories());
      const redis = await dbRedis();

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      experts.order.isValidDataToConfirmOrder(event);

      // valido si el pedido le pertenece al cliente
      const order = await Order.getByOrderIdAndClientId(event);
      experts.order.validateExistsResult(order);

      // valido si el pedido ha sido confimado de antes
      experts.order.validateIfOrderIsConfirmed(order.status);

      // obtengo los items del pedido
      const redisItems = await redis.order.get(event, event.orderId);
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });
      const { deliverydate } = operationDates;

      const orderDeliveryDate = deliverydate.visitDate;

      redis.closeConnection();

      // Validar si obtuvo algo
      experts.order.validateExistsResult(redisItems.items);

      // Creo los items en la MySQL
      event.items = redisItems.items;
      const items = await OrderItem.create(event);

      // TODO: Validar el estado actual del pedido para no cambiar un pedido que ya se grabó o se envió a SAP o se canceló
      // const orderToUpdate = await Order.getById(event);
      // experts.order.isValidStatus(orderToUpdate);

      const { DYNAMODB_TABLE_NAME_CALCULATION_RESULT } = await getTableNames();
      const { Repository } = awsRepositories;

      const id = `${event.cpgId}-${event.countryId}-${event.organizationId}-${event.orderId}-${event.clientId}`;

      // obtenemos el total Acumulado por Segmento desde Dynamo
      const { Item } = await Repository.get(DYNAMODB_TABLE_NAME_CALCULATION_RESULT, { id });
      console.debug('##################### Item ##################### ', Item, '#####################');
      console.log('obtengo los sub totales por segmento');
      console.log(util.inspect(Item, false, null, true /* enable colors */));

      if (event.paymentMethod === 'CREDIT') {
        await sendToSQS(getInstanceQueue, uuid, event, Item);
      }

      // TODO: borrar los datos del pedido de redis

      // Actualizar estado de la cabecera del pedido
      await Order.update(event, { status: 'created', orderDeliveryDate });

      return res.status(201).json({ orderId: event.orderId, itemsCreated: items });
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