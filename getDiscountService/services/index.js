module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  discountsHandler: require('b2b-discounts'),
  repositories: require('./repositories'),
  dbRedis: require('./redis-repositories'),
  accessControl: require('b2b-access-control'),
  awsRepositories: require('./aws.repositories'),
  getTableName: require('./aws.config'),
  inspect: require('util').inspect,
  rounding: require('b2b-rounding'),
  taxes: require('b2b-taxes'),
};
