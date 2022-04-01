const dotenv = require('dotenv').config();
const services = require('./services');
const { createVisitPlan } = require('./lambda')(services);

exports.handler = createVisitPlan;