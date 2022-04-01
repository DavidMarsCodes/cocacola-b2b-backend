// const dotenv = require('dotenv').config();
const services = require('./services');
const { createBasePrice } = require('./lambda')(services);

exports.handler = createBasePrice;
