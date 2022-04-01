const { getConfigData } = require('b2b-aws-configs');

const getNameEmailTemplates = async () => {
  const awsConfig = { region: process.env.AWS_REGION };

  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const { templates } = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);

  return templates;
};

module.exports = getNameEmailTemplates;
