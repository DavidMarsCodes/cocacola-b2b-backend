module.exports = {
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  res: require('b2b-response'),
  awsRepositories: require('./aws.repositories'),
  getTableNames: require('./aws.config'),
  builder: require('./builder'),
};
