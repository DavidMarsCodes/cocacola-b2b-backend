require('dotenv').config();
const services = require('./services');
const { getClientCreditResponseStatusService } = require('./lambda')(services);

exports.handler = getClientCreditResponseStatusService;