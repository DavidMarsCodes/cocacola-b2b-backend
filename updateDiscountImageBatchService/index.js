// const dotenv = require('dotenv').config();
const services = require('./services');
const { updateDiscountImageBatchService } = require('./lambda')(services);

exports.handler = updateDiscountImageBatchService;