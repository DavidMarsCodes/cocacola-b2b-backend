const { getSecretPassword } = require('b2b-aws-configs');

const getSecretEncryptionKey = async () => getSecretPassword(`${process.env.ENVIRONMENT.toLowerCase()}Configs`, process.env.AWS_LAMBDA_FUNCTION_NAME, { region: process.env.AWS_REGION });

module.exports = getSecretEncryptionKey;