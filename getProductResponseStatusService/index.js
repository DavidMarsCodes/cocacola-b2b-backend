require('dotenv').config();
const services = require('./services');
const { getProductResponseStatusService } = require('./lambda')(services);

exports.handler = getProductResponseStatusService;