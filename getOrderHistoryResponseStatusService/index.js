require('dotenv').config();
const services = require('./services');
const { getOrderHistory } = require('./lambda')(services);


exports.handler = getOrderHistory;