const { getSecretPassword, getConfigData } = require('b2b-aws-configs');

const getSecretEncryptionKey = async () => getSecretPassword(`${process.env.ENVIRONMENT.toLowerCase()}Configs`, process.env.AWS_LAMBDA_FUNCTION_NAME, { region: process.env.AWS_REGION });

const getCognitoInfo = async () => {
  const awsConfig = { region: process.env.AWS_REGION };

  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const { USER_POOL_ID, CLIENT_ID, DYNAMODB_TABLE_NAME } = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);


  return {
    USER_POOL_ID,
    CLIENT_ID,
    DYNAMODB_TABLE_NAME,
  };
};

module.exports = {
  getSecretEncryptionKey,
  getCognitoInfo,
};