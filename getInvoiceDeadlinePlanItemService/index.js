const dotenv = require('dotenv').config();
const services = require('./services');
const { getInvoiceDeadlinePlanItem } = require('./lambda')(services);

exports.handler = getInvoiceDeadlinePlanItem;
