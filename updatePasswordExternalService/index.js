const dotenv = require('dotenv').config();
const services = require('./services');
const { updatePasswordExternal } = require('./lambda')(services);

exports.handler = updatePasswordExternal;
