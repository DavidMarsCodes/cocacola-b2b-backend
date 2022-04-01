require('dotenv').config();
const services = require('./services');
const { upsertInvoicePlan } = require('./lambda')(services);

exports.handler = upsertInvoicePlan;