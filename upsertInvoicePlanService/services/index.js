module.exports = {
  respositories: require('./repositories'),
  awsRepositories: require('b2b-aws-repositories'),
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  operations: require('./operations'),
  getTableName: require('./aws.config'),
};