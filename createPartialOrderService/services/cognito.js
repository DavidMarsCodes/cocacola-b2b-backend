const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });

class Cognito {

    #cognito
    #identityConfig

    constructor() {
      this.#cognito = new AWS.CognitoIdentityServiceProvider();
      this.#identityConfig = { ClientId: '', UserPoolId: '' };
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

    getUserPoolId(urlCognito) {
      const urlCognitoArray = urlCognito.split('/');
      return urlCognitoArray[urlCognitoArray.length - 1];
    }

    async getApplicationClientName() {
      const data = await this.#cognito.describeUserPoolClient(this.#identityConfig).promise();
      return data.UserPoolClient.ClientName;
    }
}

module.exports = Cognito;
