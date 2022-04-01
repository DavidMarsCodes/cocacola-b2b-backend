require('dotenv').config();
const services = require('./services');
const { upsertShippingPrice } = require('./lambda')(services);

exports.handler = upsertShippingPrice;
