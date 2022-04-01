const { getConfigData } = require('b2b-aws-configs');

const getConfigQueue = async (awsConfig) => {
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  return getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
};

module.exports = getConfigQueue;