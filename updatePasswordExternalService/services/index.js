const Amplify = require('aws-amplify');
const b2bAwsConfig = require('b2b-aws-configs');
const amplify = require('./amplify')(Amplify, b2bAwsConfig);

module.exports = {
  Amplify: amplify,
  res: require('b2b-response'),
  repositories: require('./repositories'),
  experts: require('b2b-managers'),
  getSecretEncryptionKey: require('./aws.config'),
  getEncryption: require('b2b-encryption'),
  handlerErrorCode: require('./handlerErrorCode'),
};
