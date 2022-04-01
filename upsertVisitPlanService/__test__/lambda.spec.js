const handler = require('../lambda');

describe('Lambda Function', () => {
  it('first tests', async () => {
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


    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getByErpId: jest.fn().mockResolvedValue({
          client: {
            address: {
              city: 'Mendiolaza',
              number: 's/n',
              observations: 'Texto de prueba',
              state: 'Cordoba',
              street: 'El Benteveo',
              zipCode: '5000',
            },
            deleted: false,
            distributionChanel: 'TRUCKS',
            erpClientId: '006612345678',
            erpPriceListId: 'PRICE-LIST-IS-00001',
            erpShippingPriceListId: 'SHIPPING-PRICE-LIST-IS-00001',
            fantasyName: 'TEST - Fantasy name',
            fiscalId: '20236879336',
            fiscalName: 'TEST - Fiscal name',
            locks: [
              { erpLockId: 19 },
              { erpLockId: 5 },
            ],
            salesOrganization: '3043',
            clientId: 10,
          },
        }),
      },
      VisitPlan: { upsert: jest.fn().mockResolvedValue({ VisitPlanId: 10 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockResolvedValue({
          Item: {
            countryId: 'AR',
            cpgId: '001',
            data: [
              {
                erpClientId: 'ERP_CLIENT1',
                erpRouteId: 'ROUTE-001',
                erpVisitPlanId: '0000000001',
                offRoute: true,
                visitDate: '2021-01-27 00:00:00.0',
                visitType: 'delivery',
              },
              {
                erpClientId: 'ERP_CLIENT2',
                erpRouteId: 'ROUTE-002',
                erpVisitPlanId: '0000000002',
                offRoute: false,
                visitDate: '2021-01-27 00:00:00.0',
                visitType: 'salesman',
              },
            ],
            organizationId: '3043',
            transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          },
        }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devVisitPlanToUpsert',
      tableNameError: 'devVisitPlanToUpsertErrors',
    });

    const experts = { client: { validateExistsResult: jest.fn() } };

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

    const { upsertVisitPlan } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertVisitPlan(event);

    expect(getTableName.mock.calls).toEqual([ [ ] ]);
    expect(repositories.mock.calls).toEqual([ [ ] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devVisitPlanToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);

    const { VisitPlan, Client, closeConnection } = await repositories();
    expect(Client.getByErpId.mock.calls).toEqual([
      [
        'ERP_CLIENT1',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        'ERP_CLIENT2',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        {
          client: {
            address: {
              city: 'Mendiolaza',
              number: 's/n',
              observations: 'Texto de prueba',
              state: 'Cordoba',
              street: 'El Benteveo',
              zipCode: '5000',
            },
            deleted: false,
            distributionChanel: 'TRUCKS',
            erpClientId: '006612345678',
            erpPriceListId: 'PRICE-LIST-IS-00001',
            erpShippingPriceListId: 'SHIPPING-PRICE-LIST-IS-00001',
            fantasyName: 'TEST - Fantasy name',
            fiscalId: '20236879336',
            fiscalName: 'TEST - Fiscal name',
            locks: [
              { erpLockId: 19 },
              { erpLockId: 5 },
            ],
            salesOrganization: '3043',
            clientId: 10,
          },
        },
      ],
      [
        {
          client: {
            address: {
              city: 'Mendiolaza',
              number: 's/n',
              observations: 'Texto de prueba',
              state: 'Cordoba',
              street: 'El Benteveo',
              zipCode: '5000',
            },
            deleted: false,
            distributionChanel: 'TRUCKS',
            erpClientId: '006612345678',
            erpPriceListId: 'PRICE-LIST-IS-00001',
            erpShippingPriceListId: 'SHIPPING-PRICE-LIST-IS-00001',
            fantasyName: 'TEST - Fantasy name',
            fiscalId: '20236879336',
            fiscalName: 'TEST - Fiscal name',
            locks: [
              { erpLockId: 19 },
              { erpLockId: 5 },
            ],
            salesOrganization: '3043',
            clientId: 10,
          },
        },
      ],
    ]);
    expect(VisitPlan.upsert.mock.calls).toEqual([

      [
        {
          clientId: 10,
          countryId: 'AR',
          cpgId: '001',
          erpVisitPlanId: '0000000001',
          offRoute: true,
          organizationId: '3043',
          route: 'ROUTE-001',
          visitDate: '2021-01-27 00:00:00.0',
          visitType: 'delivery',
        },
      ],
      [
        {
          clientId: 10,
          countryId: 'AR',
          cpgId: '001',
          erpVisitPlanId: '0000000002',
          offRoute: false,
          organizationId: '3043',
          route: 'ROUTE-002',
          visitDate: '2021-01-27 00:00:00.0',
          visitType: 'salesman',
        },
      ],
    ]);
    expect(awsRepositories.Repository.create).toHaveBeenCalled();
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


    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getByErpId: jest.fn().mockResolvedValue({
          client: {
            address: {
              city: 'Mendiolaza',
              number: 's/n',
              observations: 'Texto de prueba',
              state: 'Cordoba',
              street: 'El Benteveo',
              zipCode: '5000',
            },
            deleted: false,
            distributionChanel: 'TRUCKS',
            erpClientId: '006612345678',
            erpPriceListId: 'PRICE-LIST-IS-00001',
            erpShippingPriceListId: 'SHIPPING-PRICE-LIST-IS-00001',
            fantasyName: 'TEST - Fantasy name',
            fiscalId: '20236879336',
            fiscalName: 'TEST - Fiscal name',
            locks: [
              { erpLockId: 19 },
              { erpLockId: 5 },
            ],
            salesOrganization: '3043',
            clientId: 10,
          },
        }),
      },
      VisitPlan: { upsert: jest.fn().mockResolvedValue({ VisitPlanId: 10 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockRejectedValue({ ok: false }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devVisitPlanToUpsert',
      tableNameError: 'devVisitPlanToUpsertErrors',
    });

    const experts = { client: { validateExistsResult: jest.fn() } };

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

    const { upsertVisitPlan } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertVisitPlan(event);

    expect(getTableName.mock.calls).toEqual([ [ ] ]);
    expect(repositories.mock.calls).toEqual([ [ ] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devVisitPlanToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);

    const { VisitPlan, Client, closeConnection } = await repositories();
    expect(Client.getByErpId.mock.calls).toEqual([]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);
    expect(VisitPlan.upsert.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });
});