const dotenv = require('dotenv').config();
const services = require('./services');
const { getClient } = require('./lambda')(services);

exports.handler = getClient;