require('dotenv').config();
const services = require('./services');
const { getBasePriceResponseStatus } = require('./lambda')(services);

exports.handler = getBasePriceResponseStatus;
