require('dotenv').config();
const services = require('./services');
const { insertSuggestedProducts } = require('./lambda')(services);

exports.handler = insertSuggestedProducts;
