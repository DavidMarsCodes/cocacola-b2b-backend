const AWS = require('aws-sdk');
const S3Manager = require('b2b-aws-s3');
const awsConfigs = require('./aws.config');

AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3();

const initializeInstanceOfS3Manager = ({ s3, awsConfigs, S3Manager }) => async (countryId) => {
  const { bucketName, filePath } = await awsConfigs.getConfigBucket(countryId);
  return new S3Manager(s3, bucketName, filePath);
};

const init = initializeInstanceOfS3Manager({ s3, awsConfigs, S3Manager });

module.exports = { init };