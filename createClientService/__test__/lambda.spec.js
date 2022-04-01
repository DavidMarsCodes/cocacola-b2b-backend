const handler = require('../lambda');
const { clientMock } = require('./__mocks__/clients');

describe('Lambda Function', () => {
  it('You should save an order in the dynamoDB database.', async () => {

    const event = {
      transactionId: '111111',
      organizationId: '3043',
      cpgId: '001',
      countryId: 'AR',
      clients: [
        {
          clientId: '001AR3043-ERP-TEST-A',
          fiscalId: '227777777722',
          fiscalName: 'Test SA',
          fantasyName: 'TEST-A SA',
          parentClientId: '8888888',
          erpClientId: 'ERP_TEST-A',
          salesOrganization: 'Test',
          distributionChannel: 'Masivo',
          address: {
            street: 'Salguero',
            doorNumber: '227',
            state: 'Buenos Aires',
            city: 'San Isidro',
            zipCode: '1609',
            observations: 'El unico lugar que vale la pena',
          },
          locks: [
            { erpLockId: '001AR3043-LOCK-DELETED' },
          ],
        },
      ],
      createdTime: expect.any(String),
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devSuggestedProductToUpsert' });

    const experts = { client: { validateUpsertClient: jest.fn() } };

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

    const { createClient } = handler({ awsRepositories, getTableName, experts, res });
    await createClient(event);

    expect(experts.client.validateUpsertClient.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devSuggestedProductToUpsert',
        event,
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
  });

  it('It should answer a validation error in case any of the required parameters are invalid.', async () => {

    const event = {
      transactionId: '111111',
      organizationId: '3043',
      cpgId: '001',
      countryId: 'AR',
      clients: [
        {
          clientId: '001AR3043-ERP-TEST-A',
          fiscalId: '227777777722',
          fiscalName: 'Test SA',
          fantasyName: 'TEST-A SA',
          parentClientId: '8888888',
          erpClientId: 'ERP_TEST-A',
          salesOrganization: 'Test',
          distributionChannel: 'Masivo',
          address: {
            street: 'Salguero',
            doorNumber: '227',
            state: 'Buenos Aires',
            city: 'San Isidro',
            zipCode: '1609',
            observations: 'El unico lugar que vale la pena',
          },
          locks: [
            { erpLockId: '001AR3043-LOCK-DELETED' },
          ],
        },
      ],
      createdTime: expect.any(String),
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devSuggestedProductToUpsert' });

    const experts = {
      client: {
        validateUpsertClient: jest.fn(data => {
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

    const { createClient } = handler({ awsRepositories, getTableName, experts, res });
    await createClient(event);

    expect(getTableName.mock.calls).toEqual([ ]);

    expect(experts.client.validateUpsertClient.mock.calls).toMatchSnapshot([
      [
        event,
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
      transactionId: '111111',
      organizationId: '3043',
      cpgId: '001',
      countryId: 'AR',
      clients: [
        {
          clientId: '001AR3043-ERP-TEST-A',
          fiscalId: '227777777722',
          fiscalName: 'Test SA',
          fantasyName: 'TEST-A SA',
          parentClientId: '8888888',
          erpClientId: 'ERP_TEST-A',
          salesOrganization: 'Test',
          distributionChannel: 'Masivo',
          address: {
            street: 'Salguero',
            doorNumber: '227',
            state: 'Buenos Aires',
            city: 'San Isidro',
            zipCode: '1609',
            observations: 'El unico lugar que vale la pena',
          },
          locks: [
            { erpLockId: '001AR3043-LOCK-DELETED' },
          ],
        },
      ],
      createdTime: expect.any(String),
    };

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devSuggestedProductToUpsert' });

    const experts = { client: { validateUpsertClient: jest.fn() } };

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

    const { createClient } = handler({ awsRepositories, getTableName, experts, res });
    await createClient(event);

    expect(experts.client.validateUpsertClient.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devSuggestedProductToUpsert',
        event,
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'server_error',
        500,
      ],
    ]);
  });

});