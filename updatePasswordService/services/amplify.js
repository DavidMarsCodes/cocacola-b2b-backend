const Amplify = require('aws-amplify');
const b2bAwsConfig = require('b2b-aws-configs');

const setConfigAmplify = (Amplify, b2bAwsConfig) => ({
  init: async () => {
    const awsConfig = { region: process.env.AWS_REGION };
    const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
    const config = await b2bAwsConfig.getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
    const { IDENTITY_POOL_ID, USER_POOL_ID, CLIENT_ID } = config;

    Amplify.Auth.configure({
      identityPoolId: IDENTITY_POOL_ID,
      region: process.env.AWS_REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
    });

    return Amplify;
  },
});

const amplify = setConfigAmplify(Amplify, b2bAwsConfig);

module.exports = amplify;