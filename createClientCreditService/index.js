require('dotenv').config();
const services = require('./services');
const { createClientCreditService } = require('./lambda')(services);

exports.handler = createClientCreditService;