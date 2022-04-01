const { getConfigData } = require('b2b-aws-configs');

const initCognito = async (sourceChannel, strategy, AWS) => {
  const awsConfig = { region: process.env.AWS_REGION };
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
  const { USER_POOL_ID, CLIENT_ID, GROUP_NAME } = config.cognitoConfigs[sourceChannel];

  const cognito = await strategy({ AWS, USER_POOL_ID, CLIENT_ID, GROUP_NAME });

  return { cognito };
};

module.exports = initCognito;