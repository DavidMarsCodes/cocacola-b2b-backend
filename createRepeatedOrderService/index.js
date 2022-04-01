require('dotenv').config();
const services = require('./services');
const { createRepeatedOrder } = require('./lambda')(services);

(async () => await createRepeatedOrder({}))()
exports.handler = createRepeatedOrder;