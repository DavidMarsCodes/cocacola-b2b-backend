module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  awsS3: require('./s3.config'),
  erp: require('./erp.config'),
  accessControl: require('b2b-access-control'),
};