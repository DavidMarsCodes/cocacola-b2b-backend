const instanceCognito = ({ AWS, USER_POOL_ID, GROUP_NAME }) => ({
  signUp: async (email, cellphone, password) => {
    const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

    // generamos un string ALEATORIO de 64 digitos con mayusculas minusculas y simbolos especiales
    const randomPassword = new Array(64)
      .fill()
      .map(() => String.fromCharCode(Math.random() * 86 + 40))
      .join('');

    const createUserResponse = await cognito.adminCreateUser({
      // "DesiredDeliveryMediums": [ "string" ],
      ForceAliasCreation: false,
      MessageAction: 'SUPPRESS',
      UserPoolId: USER_POOL_ID,
      TemporaryPassword: randomPassword,
      Username: email,
      UserAttributes: [ {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: cellphone,
      } ],
      // "ValidationData": [
      //    {
      //       "Name": "string",
      //       "Value": "string"
      //    }
      // ]
    }).promise();

    await cognito.adminAddUserToGroup({
      GroupName: GROUP_NAME,
      UserPoolId: USER_POOL_ID,
      Username: email,
    }).promise();

    await cognito.adminSetUserPassword({
      Password: password,
      Permanent: true,
      Username: email,
      UserPoolId: USER_POOL_ID,
    }).promise();

    return createUserResponse.User.Username;
  },
});

module.exports = instanceCognito;