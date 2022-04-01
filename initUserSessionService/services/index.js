module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  dbRedis: require('./redis-repositories'),
  luxon: require('luxon'),
  lodash: require('lodash'),
  accessControl: require('b2b-access-control'),
  getInstanceQueue: require('./queue/index'),
  uuid: require('uuid'),
  inspect: require('util').inspect,
};
