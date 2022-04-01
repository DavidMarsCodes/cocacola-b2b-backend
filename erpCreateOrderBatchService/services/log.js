module.exports = {
  create: async (OrderLog, order, event, error) => {

    const erpParams = {
      cpgId: order.cpgId,
      organizationId: order.organizationId,
      countryId: order.countryId,
    };

    const logEvent = {
      OK: {
        ...erpParams,
        eventType: 'RETRY',
        eventResult: 'OK',
        eventInfo: `The operation has been successful. The order data was sent with id ${order.orderId}.`,
        orderId: order.orderId,
        eventDatetime: new Date().toISOString(),
      },
      ERROR: {
        ...erpParams,
        eventType: 'RETRY',
        eventResult: 'ERROR',
        eventInfo: error ? error.message : '',
        orderId: order.orderId,
        eventDatetime: new Date().toISOString(),
      },
    };

    const log = logEvent[event];

    await OrderLog.create(log);
  },

  info: (erpOrder, erpHttpRes) => {
    console.info('Order shipped: ', erpOrder);
    console.info('Successful ERP erpHttpRes: ', {
      status: erpHttpRes.status,
      statusText: erpHttpRes.statusText,
      url: erpHttpRes.config.url,
      data: erpHttpRes.config.data,
    });
  },
};