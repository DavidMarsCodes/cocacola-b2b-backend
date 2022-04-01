// const dotenv = require('dotenv').config();
const services = require('./services');
const { createInvoicePlan } = require('./lambda')(services);

exports.handler = createInvoicePlan;