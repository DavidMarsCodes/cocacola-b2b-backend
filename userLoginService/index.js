const dotenv = require('dotenv').config();
const services = require('./services');
const { userLoginService } = require('./lambda')(services);

exports.handler = userLoginService;
