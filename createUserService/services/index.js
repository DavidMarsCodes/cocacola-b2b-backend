module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  repositories: require('./repositories'),
  initCognito: require('./cognitoStrategy'),
  lodash: require('lodash'),
  AWS: require('aws-sdk'),
  handlerErrorCode: require('./handlerErrorCode'),
  decrypt: require('./cryptoStrategy'),
  getSecretEncryption: require('./aws.secrets'),
};
