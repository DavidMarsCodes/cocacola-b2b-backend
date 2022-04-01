require('dotenv').config();
const services = require('./services');
const { getElasticSearchFiltersAndCategories } = require('./lambda')(services);

exports.handler = getElasticSearchFiltersAndCategories;
