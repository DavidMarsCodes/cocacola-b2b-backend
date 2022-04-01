const dotenv = require('dotenv').config();
const services = require('./services');
const { associateProductImageTriggerService } = require('./lambda')(services);

exports.handler = associateProductImageTriggerService;