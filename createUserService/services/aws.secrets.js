const { getSecretPasswordByChannel } = require('b2b-aws-configs');

const getSecretEncryption = async sourceChannel => await getSecretPasswordByChannel(
  `${process.env.ENVIRONMENT.toLowerCase()}Configs`,
  process.env.AWS_LAMBDA_FUNCTION_NAME,
  { region: process.env.AWS_REGION },
  sourceChannel,
);

module.exports = getSecretEncryption;