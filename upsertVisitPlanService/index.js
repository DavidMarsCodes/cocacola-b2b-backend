require('dotenv').config();
const services = require('./services');
const { upsertVisitPlan } = require('./lambda')(services);

exports.handler = upsertVisitPlan;
