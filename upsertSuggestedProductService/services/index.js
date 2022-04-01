module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  awsRepositories: require('b2b-aws-repositories'),
  getTableName: require('./aws.config'),
  buildSuggestedProductObject: require('./buildSuggestedProductObject'),
};
