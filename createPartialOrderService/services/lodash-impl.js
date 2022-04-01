const lodash = require('lodash');

const groupBy = (arr, attr) => lodash.groupBy(arr, attr);
module.exports = groupBy;