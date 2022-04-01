// const dotenv = require('dotenv').config();
const services = require('./services');
const { createProductService } = require('./lambda')(services);

exports.handler = createProductService;