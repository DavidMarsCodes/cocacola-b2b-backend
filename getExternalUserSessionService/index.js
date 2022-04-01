require('dotenv').config();
const services = require('./services');
const { getExternalUserSession } = require('./lambda')(services);

exports.handler = getExternalUserSession;