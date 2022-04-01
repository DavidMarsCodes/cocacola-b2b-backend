const dotenv = require('dotenv').config();
const services = require('./services');
const { getElasticSearchSuggestedProduct } = require('./lambda')(services);

exports.handler = getElasticSearchSuggestedProduct;