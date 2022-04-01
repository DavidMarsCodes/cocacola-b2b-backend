module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  dbRedis: require('./redis-repositories'),
  luxon: require('luxon'),
  lodash: require('lodash'),
  accessControl: require('b2b-access-control'),
  awsRepositories: require('./aws.repositories'),
  getTableName: require('./aws.config'),
  inspect: require('util').inspect,
};
