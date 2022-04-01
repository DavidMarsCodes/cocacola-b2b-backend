require('dotenv').config();
const services = require('./services');
const { upsertCreditLimitService } = require('./lambda')(services);

exports.handler = upsertCreditLimitService;
