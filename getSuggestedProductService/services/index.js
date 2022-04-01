module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  dbRedis: require('./redis-repositories'),
  accessControl: require('b2b-access-control'),
};
