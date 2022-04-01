require('dotenv').config();
const services = require('./services');
const { cancellationOrderService } = require('./lambda')(services);

exports.handler = cancellationOrderService;


