module.exports = {
  res: require('b2b-response'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
  awsRepositories: require('./aws.repositories'),
  getTableName: require('./aws.config'),
  repositories: require('./repositories'),
  experts: require('b2b-managers'),

};
