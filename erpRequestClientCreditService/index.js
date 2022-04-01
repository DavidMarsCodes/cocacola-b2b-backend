require('dotenv').config();
const services = require('./services');
const { erpClientCredit } = require('./lambda')(services);

exports.handler = erpClientCredit;


