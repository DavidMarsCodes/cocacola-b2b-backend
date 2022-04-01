// const dotenv = require('dotenv').config();
const services = require('./services');
const { updateProductImageBatchService } = require('./lambda')(services);

exports.handler = updateProductImageBatchService;
