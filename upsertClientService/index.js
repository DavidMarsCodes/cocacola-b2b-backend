require('dotenv').config();
const services = require('./services');
const { upsertClient } = require('./lambda')(services);

exports.handler = upsertClient;
