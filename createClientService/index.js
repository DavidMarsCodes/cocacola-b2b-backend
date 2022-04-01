// require('dotenv').config();
const services = require('./services');
const { createClient } = require('./lambda')(services);

exports.handler = createClient;
