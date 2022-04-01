// const dotenv = require('dotenv').config();
const services = require('./services');
const { createSuggestedProduct } = require('./lambda')(services);

exports.handler = createSuggestedProduct;