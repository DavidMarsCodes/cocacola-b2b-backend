const { getConfingS3 } = require('b2b-aws-configs');

const getConfigBucket = async () => {
  const awsConfig = { region: process.env.AWS_REGION };
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getConfingS3(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
  return config;
};

module.exports = { getConfigBucket };