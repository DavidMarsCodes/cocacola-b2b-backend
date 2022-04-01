// const dotenv = require('dotenv').config();
const services = require('./services');
const { createOrderHistory } = require('./lambda')(services);

exports.handler = createOrderHistory;