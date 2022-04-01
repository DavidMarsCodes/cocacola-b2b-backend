const handler = require('../lambda');

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2021-02-18'));
});

describe('Lambda Function', () => {
  it('this should update or insert credit limit records from the dynamoDB database via a transactionId.', async () => {
    const event = {
      Records: [
        {
          eventID: '033f9c60dd5da9fea97922d4d06dc50e',
          eventName: 'INSERT',
          eventVersion: '1.1',
          eventSource: 'aws:dynamodb',
          awsRegion: 'us-east-1',
          dynamodb:
                        {
                          ApproximateCreationDateTime: 1609856134,
                          Keys: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } },
                          NewImage: {
                            organizationId: { S: '3043' },
                            cpgId: { S: '001' },
                            data: { L: [ { M: {} } ] },
                            countryId: { S: 'AR' },
                            transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
                          },
                          SequenceNumber: '4136500000000007589800824',
                          SizeBytes: 372,
                          StreamViewType: 'NEW_IMAGE',
                        },
          eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
        },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            transactionId: 'b2074bf9-c53b-4516-a80c-0a04ed332522',
            cpgId: '001',
            countryId: 'CL',
            data: [
              {
                erpSegmentId: 'CL001',
                available: 900.01,
                creditLimit: 10000,
                erpPayertId: 'Payer1',
                currencyId: 'CLP',
                erpClientId: '0500266095',
              },
            ],
            organizationId: '3043',
          },
        }),
        create: jest.fn().mockResolvedValue({ ok: true }),
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: {
        upsert: jest.fn().mockResolvedValue({}),
        getByAvailable: jest.fn().mockResolvedValue({}),
      },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      Segment: { getSegmentIdByErpId: jest.fn().mockResolvedValue({ segmentId: 1 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME_ERRORS: 'devUpsertCreditClientErrors',
      DYNAMODB_TABLE_NAME: 'devCreditClient',
      DYNAMODB_TABLE_NAME_FLAGS: 'devCreditRequestUpdate',
    });

    const experts = {
      creditLimit: {
        validateUpsertCreditLimit: jest.fn(),
        validateUpsertItemCreditLimitData: jest.fn(),
      },
      segment: { validateExistsResult: jest.fn() },
      client: { validateExistsResult: jest.fn() },
    };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
    };

    const { upsertCreditLimitService } = handler({
      awsRepositories,
      repositories,
      getTableName,
      experts,
      res,
    });
    await upsertCreditLimitService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devCreditClient',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.creditLimit.validateUpsertCreditLimit.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          transactionId: 'b2074bf9-c53b-4516-a80c-0a04ed332522',
          data: [
            {
              erpSegmentId: 'CL001',
              available: 900.01,
              creditLimit: 10000,
              erpPayertId: 'Payer1',
              currencyId: 'CLP',
              erpClientId: '0500266095',
            },
          ],
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.creditLimit.validateUpsertItemCreditLimitData.mock.calls).toEqual([
      [
        {
          available: 900.01,
          creditLimit: 10000,
          clientId: 1,
          countryId: 'CL',
          cpgId: '001',
          erpClientId: '0500266095',
          erpSegmentId: 'CL001',
          organizationId: '3043',
          segmentId: 1,
          currencyId: 'CLP',
          erpPayertId: 'Payer1',
        },
      ],
    ]);
    const { CreditLimit, Client, Segment, closeConnection } = await repositories();
    expect(Client.getClientIdByErpId.mock.calls).toEqual([
      [
        '0500266095',
        {
          countryId: 'CL',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { clientId: 1 },
      ],
    ]);
    expect(Segment.getSegmentIdByErpId.mock.calls).toEqual([ [ 'CL001', { countryId: 'CL', cpgId: '001', organizationId: '3043' } ] ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { clientId: 1 },
      ],
    ]);
    expect(CreditLimit.upsert.mock.calls).toEqual([
      [
        {
          available: 900.01,
          creditLimit: 10000,
          clientId: 1,
          countryId: 'CL',
          cpgId: '001',
          erpClientId: '0500266095',
          erpSegmentId: 'CL001',
          organizationId: '3043',
          segmentId: 1,
          currencyId: 'CLP',
          erpPayertId: 'Payer1',
        },
      ],
    ]);
    expect(experts.segment.validateExistsResult.mock.calls).toEqual([
      [
        { segmentId: 1 },
      ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should handle an error because an asynchronous task cannot be completed.', async () => {
    const event = {
      Records: [
        {
          eventID: '033f9c60dd5da9fea97922d4d06dc50e',
          eventName: 'INSERT',
          eventVersion: '1.1',
          eventSource: 'aws:dynamodb',
          awsRegion: 'us-east-1',
          dynamodb:
                        {
                          ApproximateCreationDateTime: 1609856134,
                          Keys: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } },
                          NewImage: {
                            organizationId: { S: '3043' },
                            cpgId: { S: '001' },
                            data: { L: [ { M: {} } ] },
                            countryId: { S: 'AR' },
                            transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
                          },
                          SequenceNumber: '4136500000000007589800824',
                          SizeBytes: 372,
                          StreamViewType: 'NEW_IMAGE',
                        },
          eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
        },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockRejectedValue({ ok: false }),
        create: jest.fn().mockResolvedValue({ ok: true }),
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: {
        upsert: jest.fn().mockResolvedValue({}),
        getByAvailable: jest.fn().mockResolvedValue({}),
      },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      Segment: { getSegmentIdByErpId: jest.fn().mockResolvedValue({ segmentId: 1 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      tableNameError: 'devUpsertCreditClientErrors',
      tableName: 'devCreditClient',
    });

    const experts = {
      clientCredit: {
        validateUpsertCreditLimit: jest.fn(),
        validateUpsertItemCreditLimitData: jest.fn(),
      },
      productGroup: { validateExistsResult: jest.fn() },
      client: { validateExistsResult: jest.fn() },
    };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertCreditLimitService } = handler({
      awsRepositories,
      repositories,
      getTableName,
      experts,
      res,
    });
    await upsertCreditLimitService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        undefined,
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.clientCredit.validateUpsertCreditLimit.mock.calls).toEqual([]);
    expect(experts.clientCredit.validateUpsertItemCreditLimitData.mock.calls).toEqual([]);
    const { CreditLimit, Client, Segment, closeConnection } = await repositories();
    expect(Client.getClientIdByErpId.mock.calls).toEqual([]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);
    expect(Segment.getSegmentIdByErpId.mock.calls).toEqual([]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);
    expect(CreditLimit.upsert.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'server_error',
        500,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should handle an error because an asynchronous task cannot be completed.', async () => {
    const event = {
      Records: [
        {
          eventID: '033f9c60dd5da9fea97922d4d06dc50e',
          eventName: 'INSERT',
          eventVersion: '1.1',
          eventSource: 'aws:dynamodb',
          awsRegion: 'us-east-1',
          dynamodb:
                        {
                          ApproximateCreationDateTime: 1609856134,
                          Keys: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } },
                          NewImage: {
                            organizationId: { S: '3043' },
                            cpgId: { S: '001' },
                            data: { L: [ { M: {} } ] },
                            countryId: { S: 'AR' },
                            transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
                          },
                          SequenceNumber: '4136500000000007589800824',
                          SizeBytes: 372,
                          StreamViewType: 'NEW_IMAGE',
                        },
          eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
        },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
            cpgId: '001',
            countryId: 'CL',
            data: [
              {
                erpSegmentId: 'CL001',
                available: 900.01,
                creditLimit: 10000,
                erpPayertId: 'Payer1',
                currencyId: 'CLP',
                erpClientId: '0500266095',
              },
            ],
            organizationId: '3043',
          },
        }),
        create: jest.fn().mockResolvedValue({ ok: true }),
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: { upsert: jest.fn().mockRejectedValue({ ok: false }) },
      Client: { getClientIdByErpId: jest.fn().mockResolvedValue({ clientId: 1 }) },
      Segment: { getSegmentIdByErpId: jest.fn().mockResolvedValue({ segmentId: 1 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME_ERRORS: 'devUpsertCreditClientErrors',
      DYNAMODB_TABLE_NAME: 'devCreditClient',
      DYNAMODB_TABLE_NAME_FLAGS: 'devCreditRequestUpdate',
    });

    const experts = {
      creditLimit: {
        validateUpsertCreditLimit: jest.fn(),
        validateUpsertItemCreditLimitData: jest.fn(),
      },
      segment: { validateExistsResult: jest.fn() },
      client: { validateExistsResult: jest.fn() },
    };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertCreditLimitService } = handler({
      awsRepositories,
      repositories,
      getTableName,
      experts,
      res,
    });
    await upsertCreditLimitService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devCreditClient',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.creditLimit.validateUpsertCreditLimit.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
          data: [
            {
              erpSegmentId: 'CL001',
              available: 900.01,
              creditLimit: 10000,
              erpPayertId: 'Payer1',
              currencyId: 'CLP',
              erpClientId: '0500266095',
            },
          ],
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.creditLimit.validateUpsertItemCreditLimitData.mock.calls).toEqual([
      [
        {
          available: 900.01,
          creditLimit: 10000,
          clientId: 1,
          countryId: 'CL',
          cpgId: '001',
          erpClientId: '0500266095',
          erpSegmentId: 'CL001',
          organizationId: '3043',
          segmentId: 1,
          currencyId: 'CLP',
          erpPayertId: 'Payer1',
        },
      ],
    ]);
    const { CreditLimit, Client, Segment, closeConnection } = await repositories();
    expect(Client.getClientIdByErpId.mock.calls).toEqual([
      [
        '0500266095',
        {
          countryId: 'CL',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { clientId: 1 },
      ],
    ]);
    expect(Segment.getSegmentIdByErpId.mock.calls).toEqual([ [ 'CL001', { countryId: 'CL', cpgId: '001', organizationId: '3043' } ] ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { clientId: 1 },
      ],
    ]);
    expect(CreditLimit.upsert.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devUpsertCreditClientErrors',
        {
          createdTime: expect.any(String),
          statusArray: [
            {
              available: 900.01,
              creditLimit: 10000,
              currencyId: 'CLP',
              erpClientId: '0500266095',
              message: 'ERROR',
              operationStatus: 'Failed',
              erpPayertId: 'Payer1',
              erpSegmentId: 'CL001',
            },
          ],
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
        },
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});