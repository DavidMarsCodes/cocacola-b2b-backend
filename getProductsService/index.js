const services = require('./services');
const { getProducts } = require('./lambda')(services);

exports.handler = getProducts;
