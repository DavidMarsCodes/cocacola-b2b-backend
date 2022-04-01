// const dotenv = require('dotenv').config();
const services = require('./services');
const { getOrder } = require('./lambda')(services);

exports.handler = getOrder;
