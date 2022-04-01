const dotenv = require('dotenv').config();
const services = require('./services');
const initLambda = require('./lambda');

const { getUser } = initLambda(services);

exports.handler = getUser;
