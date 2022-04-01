require('dotenv').config();
const services = require('./services');
const { addOrderEventsToQueue } = require('./lambda')(services);

exports.handler = addOrderEventsToQueue;