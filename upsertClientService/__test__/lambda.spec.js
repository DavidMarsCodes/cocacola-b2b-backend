const handler = require('../lambda');

describe('Lambda Function', () => {
  it('this should update or insert customer records from the dynamoDB database via a transactionId.', async () => {
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
      Client: { upsert: jest.fn().mockResolvedValue({ clientId: 10 }) },
      InvoiceDeadlinePlan: { getByErpId: jest.fn().mockResolvedValue({}) },
      Lock: { getByErpId: jest.fn().mockResolvedValue({ lockId: 5 }) },
      ClientLock: {
        getByClientLockId: jest.fn().mockResolvedValue({}),
        createClientLock: jest.fn().mockResolvedValue({}),
        deleteByClientId: jest.fn().mockResolvedValue({}),
        getAllByClientId: jest.fn().mockResolvedValue({}),
      },
      PriceList: { getByErpId: jest.fn().mockResolvedValue({}) },
      ShippingPriceList: { getByErpId: jest.fn().mockResolvedValue({ shippingPriceListId: 5 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockResolvedValue({
          Item: {
            countryId: 'TEST',
            cpgId: '001',
            data: [
              {
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
                erpInvoiceDeadlinePlanId: '0937',
                locks: [
                  '01',
                  '02',
                ],
                salesOrganization: '3043',
              },
            ],
            organizationId: '3043',
            transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
          },
        }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devClientToUpsert',
      tableNameError: 'devClientToUpsertErrors',
    });

    const experts = {
      client: {
        validateUpsertClient: jest.fn(),
        validateUpsertItemClient: jest.fn(),
        validateExistsResult: jest.fn(),
      },
      priceList: { validateExistsResult: jest.fn() },
      shippingPriceList: { validateExistsResult: jest.fn() },
      invoicePlan: { validateExistsResult: jest.fn() },
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

    const { upsertClient } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertClient(event);

    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(getTableName.mock.calls).toEqual([
      [],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devClientToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.client.validateUpsertClient.mock.calls).toEqual([
      [
        {
          countryId: 'TEST',
          cpgId: '001',
          data: [
            {
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
              erpInvoiceDeadlinePlanId: '0937',
              locks: [
                '01',
                '02',
              ],
              salesOrganization: '3043',
            },
          ],
          organizationId: '3043',
          transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
        },
      ],
    ]);
    expect(experts.client.validateUpsertItemClient.mock.calls).toEqual([
      [
        {
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
          erpInvoiceDeadlinePlanId: '0937',
          locks: [
            '01',
            '02',
          ],
          salesOrganization: '3043',
          shippingPriceListId: 5,
          city: 'Mendiolaza',
          countryId: 'TEST',
          cpgId: '001',
          number: 's/n',
          observations: 'Texto de prueba',
          organizationId: '3043',
          priceListId: undefined,
          state: 'Cordoba',
          street: 'El Benteveo',
          zipCode: '5000',
        },
      ],
    ]);
    const { Client, Lock, ClientLock, PriceList, ShippingPriceList, closeConnection } = await repositories();
    expect(PriceList.getByErpId.mock.calls).toEqual([
      [
        'PRICE-LIST-IS-00001',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ShippingPriceList.getByErpId.mock.calls).toEqual([
      [
        'SHIPPING-PRICE-LIST-IS-00001',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(Client.upsert.mock.calls).toEqual([
      [
        {
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
          erpInvoiceDeadlinePlanId: '0937',
          locks: [
            '01',
            '02',
          ],
          salesOrganization: '3043',
          shippingPriceListId: 5,
          city: 'Mendiolaza',
          countryId: 'TEST',
          cpgId: '001',
          number: 's/n',
          observations: 'Texto de prueba',
          organizationId: '3043',
          priceListId: undefined,
          state: 'Cordoba',
          street: 'El Benteveo',
          zipCode: '5000',
        },
      ],
    ]);
    expect(ClientLock.getAllByClientId.mock.calls).toEqual([
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ClientLock.deleteByClientId.mock.calls).toEqual([]);
    expect(Lock.getByErpId.mock.calls).toEqual([
      [
        '01',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        '02',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ClientLock.createClientLock.mock.calls).toEqual([
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          lockId: 5,
          organizationId: '3043',
        },
      ],
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          lockId: 5,
          organizationId: '3043',
        },
      ],
    ]);
    expect(awsRepositories.Repository.create).toHaveBeenCalled();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('this should update or insert customer records and remove locks previously', async () => {
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
      Client: { upsert: jest.fn().mockResolvedValue({ clientId: 10 }) },
      InvoiceDeadlinePlan: { getByErpId: jest.fn().mockResolvedValue({}) },
      Lock: { getByErpId: jest.fn().mockResolvedValue({ lockId: 5 }) },
      ClientLock: {
        getByClientLockId: jest.fn().mockResolvedValue({}),
        createClientLock: jest.fn().mockResolvedValue({}),
        deleteByClientId: jest.fn().mockResolvedValue({}),
        getAllByClientId: jest.fn().mockResolvedValue([
          {
            cpgId: '001',
            countryId: 'AR',
            clientId: 1,
            organizationId: '3043',
            clientLockId: 1,
            lockId: 1,
          },
        ]),
      },
      PriceList: { getByErpId: jest.fn().mockResolvedValue({}) },
      ShippingPriceList: { getByErpId: jest.fn().mockResolvedValue({ shippingPriceListId: 5 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockResolvedValue({
          Item: {
            countryId: 'TEST',
            cpgId: '001',
            data: [
              {
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
                erpInvoiceDeadlinePlanId: '0937',
                locks: [
                  '01',
                  '02',
                ],
                salesOrganization: '3043',
              },
            ],
            organizationId: '3043',
            transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
          },
        }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devClientToUpsert',
      tableNameError: 'devClientToUpsertErrors',
    });

    const experts = {
      client: {
        validateUpsertClient: jest.fn(),
        validateUpsertItemClient: jest.fn(),
        validateExistsResult: jest.fn(),
      },
      priceList: { validateExistsResult: jest.fn() },
      shippingPriceList: { validateExistsResult: jest.fn() },
      invoicePlan: { validateExistsResult: jest.fn() },
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

    const { upsertClient } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertClient(event);

    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(getTableName.mock.calls).toEqual([
      [],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devClientToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.client.validateUpsertClient.mock.calls).toEqual([
      [
        {
          countryId: 'TEST',
          cpgId: '001',
          data: [
            {
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
              erpInvoiceDeadlinePlanId: '0937',
              locks: [
                '01',
                '02',
              ],
              salesOrganization: '3043',
            },
          ],
          organizationId: '3043',
          transactionId: '005056a6cb4c1edb95ec93d9fe807ecc',
        },
      ],
    ]);
    expect(experts.client.validateUpsertItemClient.mock.calls).toEqual([
      [
        {
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
          erpInvoiceDeadlinePlanId: '0937',
          locks: [
            '01',
            '02',
          ],
          salesOrganization: '3043',
          shippingPriceListId: 5,
          city: 'Mendiolaza',
          countryId: 'TEST',
          cpgId: '001',
          number: 's/n',
          observations: 'Texto de prueba',
          organizationId: '3043',
          priceListId: undefined,
          state: 'Cordoba',
          street: 'El Benteveo',
          zipCode: '5000',
        },
      ],
    ]);
    const { Client, Lock, ClientLock, PriceList, ShippingPriceList, closeConnection } = await repositories();
    expect(PriceList.getByErpId.mock.calls).toEqual([
      [
        'PRICE-LIST-IS-00001',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ShippingPriceList.getByErpId.mock.calls).toEqual([
      [
        'SHIPPING-PRICE-LIST-IS-00001',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(Client.upsert.mock.calls).toEqual([
      [
        {
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
          erpInvoiceDeadlinePlanId: '0937',
          locks: [
            '01',
            '02',
          ],
          salesOrganization: '3043',
          shippingPriceListId: 5,
          city: 'Mendiolaza',
          countryId: 'TEST',
          cpgId: '001',
          number: 's/n',
          observations: 'Texto de prueba',
          organizationId: '3043',
          priceListId: undefined,
          state: 'Cordoba',
          street: 'El Benteveo',
          zipCode: '5000',
        },
      ],
    ]);
    expect(ClientLock.getAllByClientId.mock.calls).toEqual([
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ClientLock.deleteByClientId.mock.calls).toEqual([
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(Lock.getByErpId.mock.calls).toEqual([
      [
        '01',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        '02',
        {
          countryId: 'TEST',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(ClientLock.createClientLock.mock.calls).toEqual([
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          lockId: 5,
          organizationId: '3043',
        },
      ],
      [
        {
          clientId: 10,
          countryId: 'TEST',
          cpgId: '001',
          lockId: 5,
          organizationId: '3043',
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
      Client: { upsert: jest.fn().mockResolvedValue({ clientId: 10 }) },
      InvoiceDeadlinePlan: { getByErpId: jest.fn().mockResolvedValue({}) },
      Lock: { getByErpId: jest.fn().mockResolvedValue({ lockId: 5 }) },
      ClientLock: {
        getByClientLockId: jest.fn().mockResolvedValue({}),
        createClientLock: jest.fn().mockResolvedValue({}),
        deleteByClientId: jest.fn().mockResolvedValue({}),
        getAllByClientId: jest.fn().mockResolvedValue({}),
      },
      PriceList: { getByErpId: jest.fn().mockResolvedValue({}) },
      ShippingPriceList: { getByErpId: jest.fn().mockResolvedValue({ shippingPriceListId: 5 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockRejectedValue({ ok: false }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devClientToUpsert',
      tableNameError: 'devClientToUpsertErrors',
    });

    const experts = {
      client: {
        validateUpsertClient: jest.fn(),
        validateUpsertItemClient: jest.fn(),
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

    const { upsertClient } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertClient(event);

    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(getTableName.mock.calls).toEqual([
      [],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devClientToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.client.validateUpsertClient.mock.calls).toEqual([]);
    expect(experts.client.validateUpsertItemClient.mock.calls).toEqual([]);
    const { Client, Lock, ClientLock, PriceList, ShippingPriceList, closeConnection } = await repositories();
    expect(PriceList.getByErpId.mock.calls).toEqual([]);
    expect(ShippingPriceList.getByErpId.mock.calls).toEqual([]);
    expect(Client.upsert.mock.calls).toEqual([]);
    expect(ClientLock.getAllByClientId.mock.calls).toEqual([]);
    expect(Lock.getByErpId.mock.calls).toEqual([]);
    expect(ClientLock.getByClientLockId.mock.calls).toEqual([]);
    expect(ClientLock.createClientLock.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });
});