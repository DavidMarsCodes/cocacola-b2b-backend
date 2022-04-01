module.exports = {
  awsRepositories: require('b2b-aws-repositories'),
  res: require('b2b-response'),
  getTableName: require('./aws.config'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
};