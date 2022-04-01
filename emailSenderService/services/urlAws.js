const { getConfigData } = require('b2b-aws-configs');

/** Get a source email.
 * @returns {string} - Source email.
 */
const getUrlAws = async () => {
  const awsConfig = { region: process.env.AWS_REGION };
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
  const { urlAws } = config;
  return urlAws;
};

module.exports = getUrlAws;