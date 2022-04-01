const handler = require('../lambda');

describe('updatePassword Lambda Funtion', () => {

  it('It should update a user password', async () => {
    const event = {
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      username: 'userTest',
      code: 'codeTest1233',
      password: '123@Password',
    };

    const experts = {
      user: {
        validateUpdatePasswordUserData: jest.fn().mockResolvedValue(undefined),
        validatePasswordFormat: jest.fn().mockResolvedValue(undefined),
        validateUserNameFormat: jest.fn().mockResolvedValue(undefined),
        validateCodeFormat: jest.fn().mockResolvedValue(undefined),
      },
    };

    const Amplify = { init: jest.fn().mockResolvedValue({ Auth: { forgotPasswordSubmit: jest.fn().mockResolvedValue(true) } }) };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        username: 'userTest',
        code: 'codeTest1233',
        password: '123@Password',
      }),
    });

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const handlerErrorCode = { resetCode: jest.fn() };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            message: '<html>',
            subject: 'Tu Password Ha Sido Restaurado',
            templateName: 'restorePasswordAdvice_email_template',
          },
        }),
      },
    };

    const ses = { sendEmail: jest.fn() };

    const getSourceEmail = jest.fn().mockResolvedValue('emailTest@email.com');

    const tableName = 'devEmailTemplates';

    const getUrlAws = jest.fn().mockResolvedValue('amazon.com');

    const { updatePassword } = handler({
      getSecretEncryptionKey,
      awsRepositories,
      tableName,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      ses,
      res,
      getSourceEmail,
      getUrlAws,
    });
    await updatePassword(event);

    expect(experts.user.validateUpdatePasswordUserData.mock.calls).toEqual([
      [
        {
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([
      [
        {
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
        'eee',
      ],
    ]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([
      [
        { password: '123@Password' },
      ],
    ]);
    expect(experts.user.validateUserNameFormat.mock.calls).toEqual([
      [
        { username: 'userTest' },
      ],
    ]);
    expect(experts.user.validateCodeFormat.mock.calls).toEqual([
      [
        { code: 'codeTest1233' },
      ],
    ]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.forgotPasswordSubmit.mock.calls).toEqual([
      [
        'userTest',
        'codeTest1233',
        '123@Password',
      ],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devEmailTemplates',
        { templateName: 'restorePasswordAdvice_email_template' },
      ],
    ]);
    expect(getSourceEmail.mock.calls).toEqual([ [] ]);
    expect(ses.sendEmail.mock.calls).toEqual([
      [
        'emailTest@email.com',
        'userTest',
        'Tu Password Ha Sido Restaurado',
        '<html>',
      ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([
      [
        200,
      ],
    ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      username: 'userTest',
      code: 'codeTest1233',
      password: '123@Password',
    };

    const experts = {
      user: {
        validateUpdatePasswordUserData: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'Validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
        validatePasswordFormat: jest.fn().mockResolvedValue(undefined),
        validateUserNameFormat: jest.fn().mockResolvedValue(undefined),
        validateCodeFormat: jest.fn().mockResolvedValue(undefined),
      },
    };

    const Amplify = { init: jest.fn().mockResolvedValue({ Auth: { forgotPasswordSubmit: jest.fn().mockResolvedValue(true) } }) };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        username: 'userTest',
        code: 'codeTest1233',
        password: '123@Password',
      }),
    });

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        httpStatus: 400,
        status: 'error',
        code: 2000,
        msg: 'Validation_server_error',
        type: 'Validation_error',
      }),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            message: '<html>',
            subject: 'Tu Password Ha Sido Restaurado',
            templateName: 'restorePasswordAdvice_email_template',
          },
        }),
      },
    };

    const ses = { sendEmail: jest.fn() };

    const getSourceEmail = jest.fn().mockResolvedValue('emailTest@email.com');

    const tableName = 'devEmailTemplates';

    const getUrlAws = jest.fn().mockResolvedValue('amazon.com');

    const { updatePassword } = await handler({
      getSecretEncryptionKey,
      awsRepositories,
      tableName,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      ses,
      res,
      getSourceEmail,
      getUrlAws,
    });
    await updatePassword(event);

    expect(experts.user.validateUpdatePasswordUserData.mock.calls).toEqual([
      [
        {
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([]);
    expect(experts.user.validateUserNameFormat.mock.calls).toEqual([]);
    expect(experts.user.validateCodeFormat.mock.calls).toEqual([]);
    expect(Amplify.init.mock.calls).toEqual([]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.forgotPasswordSubmit.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(getSourceEmail.mock.calls).toEqual([]);
    expect(ses.sendEmail.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        2000,
        'Validation_error',
        400,
      ],
    ]);
  });

  it('It should return a handled error in case of failure to Amplify', async () => {
    const event = {
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      username: 'userTest',
      code: 'codeTest1233',
      password: '123@Password',
    };

    const experts = {
      user: {
        validateUpdatePasswordUserData: jest.fn().mockReturnValue(undefined),
        validatePasswordFormat: jest.fn().mockReturnValue(undefined),
        validateUserNameFormat: jest.fn().mockReturnValue(undefined),
        validateCodeFormat: jest.fn().mockReturnValue(undefined),
      },
    };

    const Amplify = {
      init: jest.fn().mockResolvedValue({
        Auth: {
          forgotPasswordSubmit: jest.fn().mockRejectedValue({
            httpStatus: 400,
            status: 'error',
            code: 'ExpiredCodeException',
            message: 'Invalid code provided, please request a code again.',
            name: 'ExpiredCodeException',
          }),
        },
      }),
    };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        username: 'userTest',
        code: 'codeTest1233',
        password: '123@Password',
      }),
    });

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        message: 'Invalid code provided, please request a code again.',
        name: 'ExpiredCodeException',
        code: 2201,
      }),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            message: '<html>',
            subject: 'Tu Password Ha Sido Restaurado',
            templateName: 'restorePasswordAdvice_email_template',
          },
        }),
      },
    };

    const ses = { sendEmail: jest.fn() };

    const getSourceEmail = jest.fn().mockResolvedValue('emailTest@email.com');

    const tableName = 'devEmailTemplates';

    const getUrlAws = jest.fn().mockResolvedValue('amazon.com');

    const { updatePassword } = await handler({
      getSecretEncryptionKey,
      awsRepositories,
      tableName,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      ses,
      res,
      getSourceEmail,
      getUrlAws,
    });
    await updatePassword(event);

    expect(experts.user.validateUpdatePasswordUserData.mock.calls).toEqual([
      [
        {
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
      ],
    ]);
    expect(experts.user.validateUpdatePasswordUserData.mock.calls).toEqual([
      [
        {
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([
      [
        {
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
        'eee',
      ],
    ]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([
      [
        { password: '123@Password' },
      ],
    ]);
    expect(experts.user.validateUserNameFormat.mock.calls).toEqual([
      [
        { username: 'userTest' },
      ],
    ]);
    expect(experts.user.validateCodeFormat.mock.calls).toEqual([
      [
        { code: 'codeTest1233' },
      ],
    ]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.forgotPasswordSubmit.mock.calls).toEqual([
      [
        'userTest',
        'codeTest1233',
        '123@Password',
      ],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(getSourceEmail.mock.calls).toEqual([]);
    expect(ses.sendEmail.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Invalid code provided, please request a code again.',
        2201,
        'ExpiredCodeException',
        400,
      ],
    ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const event = {
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      username: 'userTest',
      code: 'codeTest1233',
      password: '123@Password',
    };

    const experts = {
      user: {
        validateUpdatePasswordUserData: jest.fn().mockReturnValue(undefined),
        validatePasswordFormat: jest.fn().mockReturnValue(undefined),
        validateUserNameFormat: jest.fn().mockReturnValue(undefined),
        validateCodeFormat: jest.fn().mockReturnValue(undefined),
      },
    };

    const Amplify = { init: jest.fn().mockResolvedValue({ Auth: { forgotPasswordSubmit: jest.fn().mockResolvedValue(true) } }) };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        username: 'userTest',
        code: 'codeTest1233',
        password: '123@Password',
      }),
    });

    const getSecretEncryptionKey = jest.fn().mockRejectedValue({});


    const handlerErrorCode = {
      resetCode: jest.fn({
        httpStatus: 400,
        status: 'error',
        code: 2000,
        msg: 'Validation_server_error',
        type: 'Validation_error',
      }),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            message: '<html>',
            subject: 'Tu Password Ha Sido Restaurado',
            templateName: 'restorePasswordAdvice_email_template',
          },
        }),
      },
    };

    const ses = { sendEmail: jest.fn() };

    const getSourceEmail = jest.fn().mockResolvedValue('emailTest@email.com');

    const tableName = 'devEmailTemplates';

    const getUrlAws = jest.fn().mockResolvedValue('amazon.com');

    const { updatePassword } = await handler({
      getSecretEncryptionKey,
      awsRepositories,
      tableName,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      ses,
      res,
      getSourceEmail,
      getUrlAws,
    });
    await updatePassword(event);

    expect(experts.user.validateUpdatePasswordUserData.mock.calls).toEqual([
      [
        {
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          username: 'userTest',
          code: 'codeTest1233',
          password: '123@Password',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([]);
    expect(experts.user.validateUserNameFormat.mock.calls).toEqual([]);
    expect(experts.user.validateCodeFormat.mock.calls).toEqual([]);
    expect(Amplify.init.mock.calls).toEqual([]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.forgotPasswordSubmit.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(getSourceEmail.mock.calls).toEqual([]);
    expect(ses.sendEmail.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        500,
        'Server_Error',
        500,
      ],
    ]);
  });
});

