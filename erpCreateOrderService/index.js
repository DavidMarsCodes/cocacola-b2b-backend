// dotenv = require('dotenv').config();
const services = require('./services');
const { erpCreateOrder } = require('./lambda')(services);

exports.handler = erpCreateOrder;


