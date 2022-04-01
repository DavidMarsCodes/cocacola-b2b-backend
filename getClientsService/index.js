
// const dotenv = require('dotenv').config();
const services = require('./services');
const { getClients } = require('./lambda')(services);




exports.handler = getClients;

