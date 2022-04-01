const dotenv = require('dotenv').config();
const services = require('./services');
const { updatePassword } = require('./lambda')(services);

exports.handler = updatePassword;
