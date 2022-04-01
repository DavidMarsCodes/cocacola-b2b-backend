module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  dbRedis: require('./redis-repositories'),
  accessControl: require('b2b-access-control'),
  getInstanceQueue: require('./queue/context'),
  sendToSQS: require('./sendToSQS'),
  uuid: require('uuid'),
  awsRepositories: require('./aws.repositories'),
  getTableNames: require('./aws.config'),

};
