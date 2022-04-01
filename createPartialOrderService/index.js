require('dotenv').config();
const services = require('./services');
const processOrderStrategy = require('./services/processOrder/strategy')(services);
const orderDeliveryStrategy = require('./services/orderDelivery/strategy')(services);

services.processOrderStrategy = processOrderStrategy;
services.orderDeliveryStrategy = orderDeliveryStrategy;
const { createPartialOrder } = require('./lambda')(services);

exports.handler = createPartialOrder;