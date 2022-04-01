module.exports = {
  res: require('b2b-response'),
  awsRepositories: require('./aws.repositories'),
  getTableName: require('./aws.config'),
  getErpConfig: require('./erp.config'),
  erpManager: require('b2b-erp'),
};
