const { getConfigData } = require('b2b-aws-configs');

const getElasticSearchIndex = async () => {
  const awsConfig = { region: process.env.AWS_REGION };
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;

  const config = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
  const { ELASTICSEARCH_INDEX } = config;

  return ELASTICSEARCH_INDEX;
};
module.exports = getElasticSearchIndex;