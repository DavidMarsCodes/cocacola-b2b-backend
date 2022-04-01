require('dotenv').config();
const services = require('./services');
const { getDiscretionaryDiscountService } = require('./lambda')(services);


exports.handler = getDiscretionaryDiscountService;