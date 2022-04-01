require('dotenv').config();
const services = require('./services');
const { calcSubTotalsBySegmentOrder } = require('./lambda')(services);

exports.handler = calcSubTotalsBySegmentOrder;
