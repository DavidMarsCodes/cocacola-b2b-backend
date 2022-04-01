const { getConfigTableName } = require('b2b-aws-configs');

const getTableName = async () => {
  const awsConfig = { region: process.env.AWS_REGION };

  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getConfigTableName(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);

  return config;
};

module.exports = getTableName;