// Initialize environment variables.
const dotenv = require('dotenv').config();

// Servicies
const services = require('./services');
const strategies = require('./services/strategies');

services.strategies = strategies;

// Dependency injection.
const { emailSender } = require('./lambda')(services);

exports.handler = emailSender;

