const instanceCognito = ({ AWS, USER_POOL_ID, CLIENT_ID, GROUP_NAME }) => ({

  signUp: async (email, cellphone, password) => {
    const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

    const createUserResponse = await cognito.signUp({
      ClientId: CLIENT_ID,
      Password: password,
      Username: email,
      UserAttributes: [ {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: cellphone,
      } ],
    }).promise();

    await cognito.adminAddUserToGroup({
      GroupName: GROUP_NAME,
      UserPoolId: USER_POOL_ID,
      Username: email,
    }).promise();

    return createUserResponse.UserSub;
  },

});

module.exports = instanceCognito;