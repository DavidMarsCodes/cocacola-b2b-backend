module.exports = {
  res: require('b2b-response'),
  repositories: require('./repositories'),
  experts: require('b2b-managers'),
  awsConfig: require('./aws-config'),
  handlerErrorCode: require('./handlerErrorCode'),
  getEncryption: require('b2b-encryption'),
  awsRepositories: require('./aws.repositories'),
  uuid: require('uuid'),
  Cognito: require('./cognito'),
};
