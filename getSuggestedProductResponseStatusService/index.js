require('dotenv').config();
const services = require('./services');
const { getSuggestedProductResponseStatus } = require('./lambda')(services);

exports.handler = getSuggestedProductResponseStatus;