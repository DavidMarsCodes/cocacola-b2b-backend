module.exports = {
  handler: (err, order) => {
    const errTypes = {
      OTHER: {
        meta: err.toJSON ? err.toJSON() : err,
        code: err.code,
        message: err.message,
        orderId: order.orderId,
      },
      ECONNABORTED: {
        code: 'ECONNABORTED',
        timeOut: true,
        message: 'The conection time out expired.',
        meta: err.toJSON ? err.toJSON() : err,
        orderId: order.orderId,
      },
    };

    return errTypes[err.code.toUpperCase()] || errTypes.OTHER;
  },
};