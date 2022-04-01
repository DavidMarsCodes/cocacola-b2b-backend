// const dotenv = require('dotenv').config();
const services = require('./services');
const { postClientLock } = require('./lambda')(services);

exports.handler = postClientLock;
