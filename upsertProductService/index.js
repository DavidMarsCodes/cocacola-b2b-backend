// dotenv = require('dotenv').config();
const services = require('./services');
const { upsertProductService } = require('./lambda')(services);

exports.handler = upsertProductService;
