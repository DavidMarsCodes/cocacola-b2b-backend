const handlerCognitoCustomMessage = require('../lambda');

describe('GetCognitoCustomMessage Lambda Function', () => {
  it('Should get templates from DynamoDB', async() => {

    const event = {
      messageType: 'CustomMessage_SignUp',
      triggerSource: 'CustomMessage_SignUp',
      request: { codeParameter: '8733' },
      response: {
        emailSubject: 'Welcome to the service',
        emailMessage: 'Thank you for signing up. Your verification code is ',
      },
    };

    const tableName = 'devCognitoCustomMessage';

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            subject: 'Subject de prueba',
            message: 'Message de prueba',
          },
        }),
      },
    };

    const res = {
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerCognitoCustomMessage({ awsRepositories, tableName, res }).getCognitoCustomMessage(event);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([ [ 'devCognitoCustomMessage', { messageType: event.triggerSource } ] ]);
    expect(result).toEqual({
      messageType: 'CustomMessage_SignUp',
      triggerSource: 'CustomMessage_SignUp',
      request: { codeParameter: '8733' },
      response: {
        emailSubject: 'Subject de prueba',
        emailMessage: 'Message de prueba',
      },
    });
  });

});