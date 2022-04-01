// dotenv = require('dotenv').config();
const services = require('./services');
const { getGeoLocation } = require('./lambda')(services);

exports.handler = getGeoLocation;
