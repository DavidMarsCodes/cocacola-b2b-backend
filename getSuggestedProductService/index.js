const dotenv = require('dotenv').config();
const services = require('./services');
const { getSuggestedProduct } = require('./lambda')(services);

exports.handler = getSuggestedProduct;
