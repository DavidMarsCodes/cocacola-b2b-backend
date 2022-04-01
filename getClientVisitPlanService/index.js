require('dotenv').config();
const services = require('./services');
const strategies = require('./services/strategies');

services.strategies = strategies;

const { getClientVisitPlan } = require('./lambda')(services);

exports.handler = getClientVisitPlan;