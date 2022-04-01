module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  awsRepositories: require('b2b-aws-repositories'),
  getTableName: require('./aws.config'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
};
