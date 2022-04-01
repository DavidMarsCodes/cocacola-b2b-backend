const dotenv = require('dotenv').config();
const services = require('./services');
const { deleteDiscountDomainService } = require('./lambda')(services);

exports.handler = deleteDiscountDomainService;
