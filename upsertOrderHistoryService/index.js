require('dotenv').config();
const services = require('./services');
const { upsertOrderHistory } = require('./lambda')(services);

exports.handler = upsertOrderHistory;
