const dotenv = require('dotenv').config();
const services = require('./services');
const { inspect } = require('util');
const { getDiscountService } = require('./lambda')(services);

exports.handler = getDiscountService;
