require('dotenv').config();
const services = require('./services');
const { getInvoicePlanStatus } = require('./lambda')(services);

exports.handler = getInvoicePlanStatus;