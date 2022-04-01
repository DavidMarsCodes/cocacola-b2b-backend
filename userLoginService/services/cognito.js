const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });

class Cognito {
    #cognito;
    #identityConfig;
    #authFlow;

    constructor() {
      this.#cognito = new AWS.CognitoIdentityServiceProvider();
      this.#identityConfig = {
        ClientId: '',
        UserPoolId: '',
      };
      this.#authFlow = 'ADMIN_NO_SRP_AUTH';
    }

    get getIdentityConfig() {
      return this.#identityConfig;
    }

    get getCognitoInstace() {
      return this.#cognito;
    }

    setIdentityConfig(clientId, userPoolId) {
      this.#identityConfig = {
        ClientId: clientId,
        UserPoolId: userPoolId,
      };
    }

    async adminGetUser({ Username, UserPoolId }) {
      return this.#cognito
        .adminGetUser({
          Username,
          UserPoolId,
        })
        .promise();
    }

    async adminInitiateAuth({ UserPoolId, ClientId, AuthParameters }) {
      return this.#cognito
        .adminInitiateAuth({
          UserPoolId,
          ClientId,
          AuthFlow: this.#authFlow,
          AuthParameters,
        })
        .promise();
    }
}

module.exports = Cognito;
