module.exports = {
  accessControl: require('b2b-access-control'),
  repositories: require('./repositories'),
  experts: require('b2b-managers'),
  res: require('b2b-response'),
  dbRedis: require('./redis-repositories'),
  awsRepositories: require('./aws.repositories'),
  getTableNames: require('./aws.config'),
  getSubTotalBySegments: require('./getSubTotalBySegments'),
  creditCalculation: require('./creditCalculation'),

};
