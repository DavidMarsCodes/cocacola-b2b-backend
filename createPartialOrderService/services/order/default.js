module.exports = {
  set: async ({ event, params, Discount, redis }) => {
    const orderClient = {};

    // Obtengo las exclusiones de Redis. Si no tiene, los busco en la BD y los cargo a Redis.
    let exclusionsArray = await redis.discountExclusions.get(event);
    if (!exclusionsArray) {
      exclusionsArray = await Discount.getAllExclusions(params);
      await redis.discountExclusions.upsert(event, exclusionsArray);
    }

    orderClient.orderId = event.orderId;

    return { orderClient, exclusionsArray };
  },
};