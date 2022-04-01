// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

// Servicies
const services = require('./services');

// Dependency injection.
const { getOrderInvoice } = require('./lambda')(services);

exports.handler = getOrderInvoice;