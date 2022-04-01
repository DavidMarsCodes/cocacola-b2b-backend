require('dotenv').config();
const services = require('./services');
const { upsertBasePrice } = require('./lambda')(services);

exports.handler = upsertBasePrice;
