const dotenv = require('dotenv').config();
const services = require('./services');
const { syncClientUserToDynamoDBService } = require('./lambda')(services);

exports.handler = syncClientUserToDynamoDBService;
