const dotenv = require('dotenv').config();
const services = require('./services');
const { getElasticSearchPortfolio } = require('./lambda')(services);


exports.handler = getElasticSearchPortfolio;