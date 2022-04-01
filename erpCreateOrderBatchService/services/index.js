module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
  operations: require('./operations'),
  lodash: require('lodash'),
  enabledStates: require('./constants/status'),
};
