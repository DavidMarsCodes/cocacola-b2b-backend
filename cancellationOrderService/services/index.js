module.exports = {
  accessControl: require('b2b-access-control'),
  repositories: require('./repositories'),
  experts: require('b2b-managers'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
  res: require('b2b-response'),
  getInstanceQueue: require('./queue/context'),
  sendToSQS: require('./sendToSQS'),
  uuid: require('uuid'),

};
