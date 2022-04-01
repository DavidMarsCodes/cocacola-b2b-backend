const { getRepositories: initRepos } = require('b2b-repositories');
const { getConfigSecret } = require('b2b-aws-configs');

const getRepositories = async () => {
  const awsConfig = { region: `us-east-1` };
  // TODO: Ver si estas configs vienen por parámetro o como variables de entorno.
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getConfigSecret(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
  return await initRepos(config);
};

module.exports = getRepositories;
