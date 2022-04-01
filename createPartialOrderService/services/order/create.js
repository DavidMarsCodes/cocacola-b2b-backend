module.exports = {
  set: async ({ event, experts, cognito, getSourceChannel, params, Order, Discount, redis }) => {

    // Valido la fecha de entrada para crear la cabecera del pedido.
    experts.order.isValidDate(event.deliverydate.visitDate);

    // Formateo la fecha de entrega.
    const orderDeliveryDate = experts.order.formatDate(event.deliverydate.visitDate);

    // // Asigno nuevos valores en el objeto event.
    event.orderDeliveryDate = orderDeliveryDate;
    event.status = 'initiated';

    // Solicitar Canal utilizando un servicio de cognito.
    const applicationClientName = await cognito.getApplicationClientName();

    // Extraer el canal desde el user aplication id
    const sourceChannel = getSourceChannel(applicationClientName);

    // Setear la propiedad sourceChannel dentro del evento
    event.sourceChannel = sourceChannel;

    // Creo la cabecera del pedido en MySQL
    const orderClient = await Order.create(event);

    // Obtengo las exclusiones de la BD
    const exclusionsArray = await Discount.getAllExclusions(params);

    // Grabo en Redis las exclusiones
    await redis.discountExclusions.upsert(event, exclusionsArray);

    return { orderClient, exclusionsArray };
  },
};

