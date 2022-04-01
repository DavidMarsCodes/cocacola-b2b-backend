const dotenv = require('dotenv').config();
const services = require('./services');
const { getLabel } = require('./lambda')(services);

exports.handler = getLabel;
