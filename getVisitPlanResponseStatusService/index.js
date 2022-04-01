require('dotenv').config();
const services = require('./services');
const { getVisitPlanResponseStatus } = require('./lambda')(services);

exports.handler = getVisitPlanResponseStatus;