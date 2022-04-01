const handler = require('../lambda');

describe('Lambda Function', () => {
  it('It should update a user password', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      oldPassword: '123@Password',
      newPassword: 'Password@123',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      closeConnection: jest.fn(),
    });

    const Amplify = {
      init: jest.fn().mockResolvedValue({
        Auth: {
          signIn: jest.fn().mockResolvedValue(true),
          changePassword: jest.fn().mockResolvedValue(true),
          forgotPasswordSubmit: jest.fn().mockResolvedValue(true),
        },
      }),
    };

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        email: 'test@gmail.com',
        oldPassword: '123@Password',
        newPassword: 'Password@123',
      }),
    });

    const handlerErrorCode = { resetCode: jest.fn() };

    const experts = {
      user: {
        validatePasswordRecoveryUser: jest.fn().mockResolvedValue(undefined),
        validatePasswordFormat: jest.fn().mockResolvedValue(undefined),
        validateFoundUser: jest.fn(),
      },
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

    const { updatePasswordExternal } = handler({
      getSecretEncryptionKey,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      res,
      repositories,
    });
    await updatePasswordExternal(event);

    expect(experts.user.validatePasswordRecoveryUser.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([
      [
        {
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
        'eee',
      ],
    ]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([
      [
        { password: 'Password@123' },
      ],
    ]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.signIn.mock.calls).toEqual([
      [
        'test@gmail.com',
        '123@Password',
      ],
    ]);
    expect(amplify.Auth.changePassword.mock.calls).toEqual([
      [
        true,
        '123@Password',
        'Password@123',
      ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([
      [
        204,
      ],
    ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      oldPassword: '123@Password',
      newPassword: 'Password@123',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      closeConnection: jest.fn(),
    });

    const Amplify = {
      init: jest.fn().mockResolvedValue({
        Auth: {
          signIn: jest.fn().mockResolvedValue(true),
          changePassword: jest.fn().mockResolvedValue(true),
          forgotPasswordSubmit: jest.fn().mockResolvedValue(true),
        },
      }),
    };

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        email: 'test@gmail.com',
        oldPassword: '123@Password',
        newPassword: 'Password@123',
      }),
    });

    const experts = {
      user: {
        validatePasswordRecoveryUser: jest.fn(() => {
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
        validateFoundUser: jest.fn(),
      },
    };

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        httpStatus: 400,
        status: 'error',
        code: 2000,
        msg: 'Validation_server_error',
        type: 'Validation_error',
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

    const { updatePasswordExternal } = handler({
      getSecretEncryptionKey,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      res,
      repositories,
    });
    await updatePasswordExternal(event);

    expect(experts.user.validatePasswordRecoveryUser.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.signIn.mock.calls).toEqual([]);
    expect(amplify.Auth.changePassword.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(handlerErrorCode.resetCode.mock.calls).toEqual([
      [
        {
          code: 100,
          httpStatus: 400,
          msg: 'Validation_server_error',
          status: 'error',
          type: 'Validation_error',
        },
      ],
    ]);
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
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      oldPassword: '123@Password',
      newPassword: 'Password@123',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      closeConnection: jest.fn(),
    });

    const Amplify = {
      init: jest.fn().mockResolvedValue({
        Auth: {
          signIn: jest.fn().mockRejectedValue({
            httpStatus: 400,
            status: 'error',
            code: 'NotAuthorizedException',
            message: 'Incorrect username or password.',
            name: 'NotAuthorizedException',
          }),
          changePassword: jest.fn().mockResolvedValue(true),
          forgotPasswordSubmit: jest.fn().mockResolvedValue(true),
        },
      }),
    };

    const getSecretEncryptionKey = jest.fn().mockResolvedValue({ key: 'eee' });

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        email: 'test@gmail.com',
        oldPassword: '123@Password',
        newPassword: 'Password@123',
      }),
    });

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        httpStatus: 400,
        status: 'error',
        code: 405,
        message: 'Incorrect username or password.',
        name: 'ExpiredCodeException',
      }),
    };

    const experts = {
      user: {
        validatePasswordRecoveryUser: jest.fn().mockResolvedValue(undefined),
        validatePasswordFormat: jest.fn().mockResolvedValue(undefined),
        validateFoundUser: jest.fn(),
      },
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

    const { updatePasswordExternal } = handler({
      getSecretEncryptionKey,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      res,
      repositories,
    });
    await updatePasswordExternal(event);

    expect(experts.user.validatePasswordRecoveryUser.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([
      [
        {
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
        'eee',
      ],
    ]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([
      [
        { password: 'Password@123' },
      ],
    ]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.signIn.mock.calls).toEqual([
      [
        'test@gmail.com',
        '123@Password',
      ],
    ]);
    expect(amplify.Auth.changePassword.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(handlerErrorCode.resetCode.mock.calls).toEqual([
      [
        {
          code: 'NotAuthorizedException',
          httpStatus: 400,
          message: 'Incorrect username or password.',
          name: 'NotAuthorizedException',
          status: 'error',
        },
      ],
    ]);
    expect(res.error.mock.calls).toEqual([
      [
        'Incorrect username or password.',
        405,
        'ExpiredCodeException',
        400,
      ],
    ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'test@gmail.com',
      oldPassword: '123@Password',
      newPassword: 'Password@123',
    };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserByEmailOrPhoneAndTenant: jest.fn().mockResolvedValue({ username: 'pepito' }) },
      closeConnection: jest.fn(),
    });

    const Amplify = {
      init: jest.fn().mockResolvedValue({
        Auth: {
          signIn: jest.fn().mockResolvedValue(true),
          changePassword: jest.fn().mockResolvedValue(true),
          forgotPasswordSubmit: jest.fn().mockResolvedValue(true),
        },
      }),
    };

    const getSecretEncryptionKey = jest.fn().mockRejectedValue({});

    const getEncryption = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        email: 'test@gmail.com',
        oldPassword: '123@Password',
        newPassword: 'Password@123',
      }),
    });

    const handlerErrorCode = {
      resetCode: jest.fn().mockReturnValue({
        httpStatus: 400,
        status: 'error',
        code: 405,
        message: 'Invalid code provided, please request a code again.',
        name: 'ExpiredCodeException',
      }),
    };

    const experts = {
      user: {
        validatePasswordRecoveryUser: jest.fn().mockResolvedValue(undefined),
        validatePasswordFormat: jest.fn().mockResolvedValue(undefined),
        validateFoundUser: jest.fn(),
      },
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

    const { updatePasswordExternal } = handler({
      getSecretEncryptionKey,
      getEncryption,
      Amplify,
      handlerErrorCode,
      experts,
      res,
      repositories,
    });
    await updatePasswordExternal(event);

    expect(experts.user.validatePasswordRecoveryUser.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          email: 'test@gmail.com',
          oldPassword: '123@Password',
          newPassword: 'Password@123',
        },
      ],
    ]);
    expect(getSecretEncryptionKey.mock.calls).toEqual([ [] ]);
    expect(getEncryption().decryptAll.mock.calls).toEqual([]);
    expect(experts.user.validatePasswordFormat.mock.calls).toEqual([]);
    const amplify = await Amplify.init();
    expect(amplify.Auth.signIn.mock.calls).toEqual([]);
    expect(amplify.Auth.changePassword.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(handlerErrorCode.resetCode.mock.calls).toEqual([]);
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