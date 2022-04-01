// const dotenv = require('dotenv').config();
const services = require('./services');
const { getCognitoCustomMessage } = require('./lambda')(services);

exports.handler = getCognitoCustomMessage;
