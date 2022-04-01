require('dotenv').config();
const services = require('./services');
const strategies = require('./services/strategies');

services.strategies = strategies;
const { setOperationDates } = require('./lambda')(services);

exports.handler = setOperationDates;
