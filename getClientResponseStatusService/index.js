require('dotenv').config();
const services = require('./services');
const { getClientResponseStatus } = require('./lambda')(services);

exports.handler = getClientResponseStatus;