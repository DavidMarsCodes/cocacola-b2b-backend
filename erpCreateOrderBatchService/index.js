require('dotenv').config();
const services = require('./services');
const { erpCreateBatchOrder } = require('./lambda')(services);

exports.handler = erpCreateBatchOrder;


