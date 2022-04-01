const dotenv = require('dotenv').config();
const services = require('./services');
const { getClientCredit } = require('./lambda')(services);

exports.handler = getClientCredit;