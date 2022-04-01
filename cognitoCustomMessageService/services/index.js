module.exports = {
  awsRepositories: require('b2b-aws-repositories'),
  res: require('b2b-response'),
  tableName: `${process.env.ENVIRONMENT.toLowerCase()}CognitoCustomMessage`,
};
