require('dotenv').config();
const services = require('./services');
const { confirmOrder } = require('./lambda')(services);

exports.handler = confirmOrder;
