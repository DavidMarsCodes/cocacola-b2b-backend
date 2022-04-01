// const dotenv = require('dotenv').config();
const services = require('./services');
const { createOrder } = require('./lambda')(services);

exports.handler = createOrder;
