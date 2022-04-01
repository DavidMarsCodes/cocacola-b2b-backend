const handlerUser = require('../lambda');
const lodash = require('lodash');

describe('CREATE USER LAMBDA FUNCTION', () => {
  it('Should create a User into Cognito & RDS.', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockReturnValue(
          'ae49ff13-a586-432c-89f2-f8da3a64c719',
        ),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          cellphone: '+561111111112',
          client: {
            fiscalId: '03861279-4',
            erpClientId: '0500291871',
          },
          erpClientId: '0500291871',
          fiscalId: '03861279-4',
          email: 'juan.perez@gmail.com',
          fieldSelectedToLogin: 'email',
          firstName: 'juan',
          lastName: 'perez',
          password: 'Prueba123@',
          sourceChannel: 'B2B',
          username: 'ae49ff13-a586-432c-89f2-f8da3a64c719',
        },
      ],
    ]);

    expect(cognito.signUp.mock.calls).toEqual([
      [
        'juan.perez@gmail.com',
        '+561111111112',
        'Prueba123@',
      ],
    ]);

    expect(User.create.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          cellphone: '+561111111112',
          client: {
            fiscalId: '03861279-4',
            erpClientId: '0500291871',
          },
          erpClientId: '0500291871',
          fiscalId: '03861279-4',
          email: 'juan.perez@gmail.com',
          fieldSelectedToLogin: 'email',
          firstName: 'juan',
          lastName: 'perez',
          password: 'Prueba123@',
          sourceChannel: 'B2B',
          username: 'ae49ff13-a586-432c-89f2-f8da3a64c719',
        },
      ],
    ]);

    expect(ClientUser.get.mock.calls).toEqual([
      [
        1,
      ],
    ]);

    expect(ClientUser.create.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
          userId: 2,
          rol: 'Administrator',
        },
      ],
    ]);

    expect(result).toEqual({
      httpStatus: 201,
      ok: true,
      code: 0,
      data: {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        sourceChannel: 'B2B',
        username: 'ae49ff13-a586-432c-89f2-f8da3a64c719',
      },
    });
  });

  it('Should throw "Client dont exist" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue(
          null,
        ),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockReturnValue(
          'ae49ff13-a586-432c-89f2-f8da3a64c719',
        ),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([]);

    expect(cognito.signUp.mock.calls).toEqual([]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 1100,
      errorType: 'client',
      httpStatus: 400,
      message: "Client don't exist",
      ok: false,
    });
  });

  it('Should throw "client not active" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
          deleted: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockReturnValue(
          'ae49ff13-a586-432c-89f2-f8da3a64c719',
        ),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([]);

    expect(cognito.signUp.mock.calls).toEqual([]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 1101,
      errorType: 'client',
      httpStatus: 400,
      message: 'The client is not active.',
      ok: false,
    });
  });

  it('Should throw "client has locks of type lockSingIn" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([ { lockId: 1 } ]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockReturnValue(
          'ae49ff13-a586-432c-89f2-f8da3a64c719',
        ),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([]);

    expect(cognito.signUp.mock.calls).toEqual([]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 1102,
      errorType: 'client',
      httpStatus: 400,
      message: 'This client has locks of type lockSingIn.',
      ok: false,
    });
  });

  it('Should throw "email_already_exists" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockRejectedValue({
          code: '',
          message: 'An account with the given email already exists.',
        }),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          cellphone: '+561111111112',
          client: {
            fiscalId: '03861279-4',
            erpClientId: '0500291871',
          },
          erpClientId: '0500291871',
          fiscalId: '03861279-4',
          email: 'juan.perez@gmail.com',
          fieldSelectedToLogin: 'email',
          firstName: 'juan',
          lastName: 'perez',
          password: 'Prueba123@',
          sourceChannel: 'B2B',
        },
      ],
    ]);

    expect(cognito.signUp.mock.calls).toEqual([
      [
        'juan.perez@gmail.com',
        '+561111111112',
        'Prueba123@',
      ],
    ]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 2001,
      errorType: 'cognito',
      httpStatus: 400,
      message: 'email_already_exists',
      ok: false,
    });
  });

  it('Should throw "InvalidPasswordException" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockRejectedValue({
          code: 'InvalidPasswordException',
          message: '',
        }),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          cellphone: '+561111111112',
          client: {
            fiscalId: '03861279-4',
            erpClientId: '0500291871',
          },
          erpClientId: '0500291871',
          fiscalId: '03861279-4',
          email: 'juan.perez@gmail.com',
          fieldSelectedToLogin: 'email',
          firstName: 'juan',
          lastName: 'perez',
          password: 'Prueba123@',
          sourceChannel: 'B2B',
        },
      ],
    ]);

    expect(cognito.signUp.mock.calls).toEqual([
      [
        'juan.perez@gmail.com',
        '+561111111112',
        'Prueba123@',
      ],
    ]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 2002,
      errorType: 'cognito',
      httpStatus: 400,
      message: 'password_invalid',
      ok: false,
    });
  });

  it('Should throw "InvalidParameterException" error', async() => {

    // LAMBDA INPUT

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      b2bSession: { Authorization: 'Bearer token' },
      fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
      firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
      lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
      email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
      cellphone: '1VdRm1O3NydyruWprbkqnA==',
      password: '23RdvjNAp97CIw6OnFnxxA==',
      client: {
        erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
        fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
      },
      sourceChannel: 'B2B',
    };

    // MOCKS

    const res = {
      success: jest.fn((data, status = 200) => ({
        data,
        httpStatus: status,
        ok: true,
        code: 0,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const AWS = {};

    const handlerErrorCode = {};

    const repositories = jest.fn().mockResolvedValue({
      User: {
        create: jest.fn().mockResolvedValue({
          firstName: 'juan',
          lastName: 'perez',
          userId: 2,
          updatedBy: 'TESTING',
          lastUpdate: 'DATE',
        }),
        getUserByEmailOrPhone: jest.fn().mockResolvedValue({}),
      },
      ClientUser: {
        create: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
      },
      Client: {
        getByFiscalId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'CL',
            organizationId: '3043',
            clientId: 1,
          },
        ]),
        // TODO quitar
        getByFiscalIdAndClientId: jest.fn().mockResolvedValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 1,
        }),
      },
      // TODO quitar
      ClientLock: { getLockSigIn: jest.fn().mockResolvedValue([]) },
      closeConnection: jest.fn(),
    });

    const experts = {
      user: {
        validateUserData: jest.fn(),
        checkIfUserExist: jest.fn(),
      },
    };

    const initCognito = jest.fn().mockResolvedValue({
      cognito: {
        signUp: jest.fn().mockRejectedValue({
          code: 'InvalidParameterException',
          message: '\'password\'',
        }),
      },
    });

    const decrypt = jest.fn().mockReturnValue({
      decryptAll: jest.fn().mockReturnValue({
        cellphone: '+561111111112',
        client: {
          fiscalId: '03861279-4',
          erpClientId: '0500291871',
        },
        erpClientId: '0500291871',
        fiscalId: '03861279-4',
        email: 'juan.perez@gmail.com',
        fieldSelectedToLogin: 'email',
        firstName: 'juan',
        lastName: 'perez',
        password: 'Prueba123@',
      }),
    });

    const getSecretEncryption = jest.fn().mockResolvedValue({ key: 'key' });

    // RUN LAMBDA

    const { createUser } = handlerUser({ repositories, experts, res, lodash, initCognito, AWS, handlerErrorCode, decrypt, getSecretEncryption });
    const result = await createUser(event);

    // TESTS

    const { User, ClientUser } = await repositories();
    const { cognito } = await initCognito();

    expect(decrypt.mock.calls).toEqual([
      [
        'B2B',
      ],
    ]);

    expect(decrypt().decryptAll.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          fieldSelectedToLogin: 'DCvpAO6A7HHuNVkN0eQ0fA==',
          firstName: 'nl8mvA27Og3X/kPAPUW+uQ==',
          lastName: '6wJ0/ck+EmYcnabyG4PqCg==',
          email: '5wuuw5pdcjSUzYat/8HhnEQvw1rNV00h6QI3p2yHomQ=',
          cellphone: '1VdRm1O3NydyruWprbkqnA==',
          password: '23RdvjNAp97CIw6OnFnxxA==',
          client: {
            erpClientId: 'R1E/aWUFbSAc2qFUFWa0tA==',
            fiscalId: 'b7Zf8m7zTxL5InFLjaUlMw==',
          },
          sourceChannel: 'B2B',
        },
        'key',
      ],
    ]);

    expect(User.getUserByEmailOrPhone.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          b2bSession: { Authorization: 'Bearer token' },
          cellphone: '+561111111112',
          client: {
            fiscalId: '03861279-4',
            erpClientId: '0500291871',
          },
          erpClientId: '0500291871',
          fiscalId: '03861279-4',
          email: 'juan.perez@gmail.com',
          fieldSelectedToLogin: 'email',
          firstName: 'juan',
          lastName: 'perez',
          password: 'Prueba123@',
          sourceChannel: 'B2B',
        },
      ],
    ]);

    expect(cognito.signUp.mock.calls).toEqual([
      [
        'juan.perez@gmail.com',
        '+561111111112',
        'Prueba123@',
      ],
    ]);

    expect(User.create.mock.calls).toEqual([]);

    expect(ClientUser.get.mock.calls).toEqual([]);

    expect(ClientUser.create.mock.calls).toEqual([]);

    expect(result).toEqual({
      code: 2002,
      errorType: 'cognito',
      httpStatus: 400,
      message: 'password_invalid',
      ok: false,
    });
  });

});