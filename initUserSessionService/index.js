require('dotenv').config();
const services = require('./services');
const { initUserSession } = require('./lambda')(services);

exports.handler = initUserSession;
