const handlerCredit = require('../lambda');

describe('Lambda Function', () => {
  it('You should save an order in the dynamoDB database.', async () => {
    const event = {
      organizationId: '111111',
      cpgId: '001',
      countryId: 'AR',
      clientId: 1,
      productGroupId: 7,
      amount: 58977,
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devClintCredit' });

    const experts = { clientCredit: { validateUpsertClientCredit: jest.fn() } };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { createClientCreditService } = handlerCredit({ awsRepositories, getTableName, experts, res });
    await createClientCreditService(event);

    expect(experts.clientCredit.validateUpsertClientCredit.mock.calls).toEqual([
      [
        {
          organizationId: '111111',
          cpgId: '001',
          countryId: 'AR',
          clientId: 1,
          productGroupId: 7,
          amount: 58977,
        },
      ],
    ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devClintCredit',
        {
          organizationId: '111111',
          cpgId: '001',
          countryId: 'AR',
          clientId: 1,
          productGroupId: 7,
          amount: 58977,
        },
      ],
    ]);
  });

  it('It should answer a validation error in case any of the required parameters are invalid.', async () => {

    const event = {
      organizationId: '111111',
      cpgId: '001',
      countryId: 'AR',
      clientId: 1,
      productGroupId: 7,
      amount: 58977,
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devSuggestedProductToUpsert' });

    const experts = {
      clientCredit: {
        validateUpsertClientCredit: jest.fn(data => {
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
      },
    };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createClientCreditService } = handlerCredit({ awsRepositories, getTableName, experts, res });
    await createClientCreditService(event);

    expect(getTableName.mock.calls).toEqual([ ]);

    expect(experts.clientCredit.validateUpsertClientCredit.mock.calls).toEqual([
      [
        {
          organizationId: '111111',
          cpgId: '001',
          countryId: 'AR',
          clientId: 1,
          productGroupId: 7,
          amount: 58977,
        },
      ],
    ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,

      ],
    ]);

  });

  it('It should return defualt error', async () => {

    const event = {
      organizationId: '111111',
      cpgId: '001',
      countryId: 'AR',
      clientId: 1,
      productGroupId: 7,
      amount: 58977,
    };

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devClintCredit' });

    const experts = { clientCredit: { validateUpsertClientCredit: jest.fn() } };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { createClientCreditService } = handlerCredit({ awsRepositories, getTableName, experts, res });
    await createClientCreditService(event);
    expect(experts.clientCredit.validateUpsertClientCredit.mock.calls).toEqual([
      [
        {
          organizationId: '111111',
          cpgId: '001',
          countryId: 'AR',
          clientId: 1,
          productGroupId: 7,
          amount: 58977,
        },
      ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devClintCredit',
        {
          organizationId: '111111',
          cpgId: '001',
          countryId: 'AR',
          clientId: 1,
          productGroupId: 7,
          amount: 58977,
        },
      ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        '{"ok":false}',
      ],
    ]);
  });

});