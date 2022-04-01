const _ = require('lodash');

const buildSuggestedProductObject = data => {
  const buildData = _.groupBy(data, 'erpClientId');

  return buildData;
};

module.exports = buildSuggestedProductObject;