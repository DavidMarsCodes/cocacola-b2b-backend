const dotenv = require('dotenv').config();
const services = require('./services');
const { getFilter } = require('./lambda')(services);

exports.handler = getFilter;
