const dotenv = require('dotenv').config();
const services = require('./services');
const { getOrderDetailService } = require('./lambda')(services);

exports.handler = getOrderDetailService;
