const dotenv = require('dotenv');
const services = require('./services');
const { getUserNameService } = require('./lambda')(services);

exports.handler = getUserNameService;
