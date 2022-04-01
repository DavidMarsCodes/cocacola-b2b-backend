require('dotenv').config();
const services = require('./services');
const { updateClientCreditAvailableService } = require('./lambda')(services);

exports.handler = updateClientCreditAvailableService;

