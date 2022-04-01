const { getConfigData } = require('b2b-aws-configs');



const getConfigQueue = async awsConfig => {
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const configurations = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);

  return configurations;
};

module.exports = getConfigQueue;