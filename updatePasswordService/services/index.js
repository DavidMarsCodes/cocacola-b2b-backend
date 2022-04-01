module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  getSecretEncryptionKey: require('./aws.config'),
  Amplify: require('./amplify'),
  getEncryption: require('b2b-encryption'),
  handlerErrorCode: require('./handlerErrorCode'),
  tableName: `${process.env.ENVIRONMENT.toLowerCase()}EmailTemplates`,
  ses: require('b2b-ses'),
  awsRepositories: require('b2b-aws-repositories'),
  getSourceEmail: require('./sourceEmail'),
  getUrlAws: require('./urlAws'),
};
