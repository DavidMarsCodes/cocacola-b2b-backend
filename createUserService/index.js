// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const services = require('./services');
const { createUser } = require('./lambda')(services);

exports.handler = createUser;
