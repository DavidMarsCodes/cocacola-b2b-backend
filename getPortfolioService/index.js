const dotenv = require('dotenv').config();
const services = require('./services');
const { getPortfolio } = require('./lambda')(services);

exports.handler = getPortfolio;