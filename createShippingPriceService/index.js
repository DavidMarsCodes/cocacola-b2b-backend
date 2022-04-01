// const dotenv = require('dotenv').config();
const services = require('./services');
const { createShippingPrice } = require('./lambda')(services);

exports.handler = createShippingPrice;
