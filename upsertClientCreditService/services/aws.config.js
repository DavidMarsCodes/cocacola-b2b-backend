const { getConfigData } = require('b2b-aws-configs');

const getTableName = async () => {
  const awsConfig = { region: process.env.AWS_REGION };

  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const { DYNAMODB_TABLE_NAME, DYNAMODB_TABLE_NAME_ERRORS, DYNAMODB_TABLE_NAME_FLAGS } = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);

  return { DYNAMODB_TABLE_NAME, DYNAMODB_TABLE_NAME_ERRORS, DYNAMODB_TABLE_NAME_FLAGS };
};

module.exports = getTableName;