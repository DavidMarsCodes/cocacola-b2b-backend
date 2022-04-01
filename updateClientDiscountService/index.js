const services = require('./services');
const { updateClientDiscount } = require('./lambda')(services);

exports.handler = updateClientDiscount;
