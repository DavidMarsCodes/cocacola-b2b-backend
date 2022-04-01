module.exports = ({ experts, dbRedis, groupBy, repositories }) => async (event, orderClient) => {

  let orderDeliveryFrozenDate;
  let orderDeliveryDate;

  const redis = await dbRedis();

  const { OrderDelivery } = await repositories();

  // obtengo los items del pedido
  const redisOrderItems = await redis.order.get(event, event.orderId);
  console.debug('redisOrderItems ', redisOrderItems);
  let deliveries = redisOrderItems ? redisOrderItems.deliveryDates : [];

  const deliveriesSaved = groupBy(event.items, 'deliveryType');

  if (deliveriesSaved.delivery && !deliveries.find((x) => x.deliveryType === 'delivery')) {
    // Valido la fecha de entrada.
    experts.order.isValidDate(event.deliverydate.visitDate);

    orderDeliveryDate = experts.order.formatDate(event.deliverydate.visitDate);

    // Formateo la fecha de entrega.
    deliveries.push({ deliveryDate: orderDeliveryDate, deliveryType: 'delivery' });

    await OrderDelivery.create(orderClient.orderId, event, orderDeliveryDate, event.deliverydate.visitType);
  } else if (!deliveriesSaved.delivery && deliveries.find((x) => x.deliveryType === 'delivery')) {

    deliveries = deliveries.filter((x) => x.deliveryType !== 'delivery');

    await OrderDelivery.delete(orderClient.orderId, 'delivery');
  }

  if (deliveriesSaved.deliveryfrozen && !deliveries.find((x) => x.deliveryType === 'deliveryFrozen')) {

    // Valido la fecha de entrada.
    experts.order.isValidDate(event.deliveryfrozen.visitDate);

    // Formateo la fecha de entrega.
    orderDeliveryFrozenDate = experts.order.formatDate(event.deliveryfrozen.visitDate);

    // Asigno nuevos valores en el objeto event.
    event.orderDeliveryFrozen = orderDeliveryFrozenDate;

    deliveries.push({ deliveryDate: orderDeliveryFrozenDate, deliveryType: 'deliveryFrozen' });

    await OrderDelivery.create(orderClient.orderId, event, orderDeliveryFrozenDate, event.deliveryfrozen.visitType);
  } else if (!deliveriesSaved.deliveryfrozen && deliveries.find((x) => x.deliveryType === 'deliveryFrozen')) {

    deliveries = deliveries.filter((x) => x.deliveryType !== 'deliveryFrozen');

    await OrderDelivery.delete(orderClient.orderId, 'deliveryFrozen');
  }

  return { deliveries };
};
