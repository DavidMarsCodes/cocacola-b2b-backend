require('dotenv').config();
const services = require('./services');
const { getShippingPriceResponseStatus } = require('./lambda')(services);

exports.handler = getShippingPriceResponseStatus;
