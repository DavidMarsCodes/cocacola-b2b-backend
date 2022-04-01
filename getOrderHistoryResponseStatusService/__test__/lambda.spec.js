const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should get records from the dynamoDB database via a transactionId.', async () => {

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
                          Keys: { transactionId: { S: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' } },
                          NewImage: {
                            organizationId: { S: '3043' },
                            cpgId: { S: '001' },
                            data: { L: [ { M: {} } ] },
                            countryId: { S: 'AR' },
                            transactionId: { S: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' },
                          },
                          SequenceNumber: '4136500000000007589800824',
                          SizeBytes: 372,
                          StreamViewType: 'NEW_IMAGE',
                        },
          eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
        },
      ],
    };

    const getTableName = jest.fn().mockResolvedValue({ tableNameError: 'UpsertOrderHistoryErrors' });

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {
                amount: 1000,
                deliveryDate: '2021-01-04T00:00:00.000Z',
                documentType: 'FC',
                erpClientId: '',
                erpOrderId: '200111',
                message: 'erpclientid_required',
                operationStatus: 'Failed',
                orderDate: '2020-12-31T00:00:00.000Z',
                orderId: null,
                orderStatus: 'entregado',
                paymentMethod: 'PAYMTD-3',
                sourceChannel: 'SFCoke',
                transportData: 'Camión 3000',
              },
              {
                amount: 300,
                clientId: 2,
                deliveryDate: '2021-01-05T00:00:00.000Z',
                documentType: 'FC',
                erpClientId: 'ERP_CLIENT2',
                erpOrderId: '200222',
                message: 'Success',
                operationStatus: 'Ok',
                orderDate: '2021-01-03T00:00:00.000Z',
                orderId: 1,
                orderStatus: 'creado',
                paymentMethod: 'PAYMTD-3',
                paymentMethodId: 3,
                sourceChannel: 'Carrito',
                transportData: 'no aplica',
              },
            ],
            transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671',
          },
        }),
      },
    };

    const getErpConfig = jest.fn().mockResolvedValue({
      authenticationType: 'BASIC',
      endpointUrl: 'https://proxy.test/',
      username: 'testUserName',
      password: 'testPassword',
    });

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
    };

    const { getOrderHistory } = handler({ awsRepositories, getTableName, getErpConfig, erpManager, res });
    const result = await getOrderHistory(event);

    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'UpsertOrderHistoryErrors',
        { transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' },
      ],
    ]);

    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([
      [
        {
          authenticationType: 'BASIC',
          endpointUrl: 'https://proxy.test/',
          username: 'testUserName',
          password: 'testPassword',
        },
      ],
    ]);

    expect(erpManager.save.mock.calls).toEqual([
      [
        {
          statusArray: [
            {
              amount: 1000,
              deliveryDate: '2021-01-04T00:00:00.000Z',
              documentType: 'FC',
              erpClientId: '',
              erpOrderId: '200111',
              message: 'erpclientid_required',
              operationStatus: 'Failed',
              orderDate: '2020-12-31T00:00:00.000Z',
              orderId: null,
              orderStatus: 'entregado',
              paymentMethod: 'PAYMTD-3',
              sourceChannel: 'SFCoke',
              transportData: 'Camión 3000',
            },
            {
              amount: 300,
              clientId: 2,
              deliveryDate: '2021-01-05T00:00:00.000Z',
              documentType: 'FC',
              erpClientId: 'ERP_CLIENT2',
              erpOrderId: '200222',
              message: 'Success',
              operationStatus: 'Ok',
              orderDate: '2021-01-03T00:00:00.000Z',
              orderId: 1,
              orderStatus: 'creado',
              paymentMethod: 'PAYMTD-3',
              paymentMethodId: 3,
              sourceChannel: 'Carrito',
              transportData: 'no aplica',
            },
          ],
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671',
        },
      ],
    ]);


  });

  it('It should throw an error because you can not get the data in DynamoDB.', async () => {

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
                          Keys: { transactionId: { S: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' } },
                          NewImage: {
                            organizationId: { S: '3043' },
                            cpgId: { S: '001' },
                            data: { L: [ { M: {} } ] },
                            countryId: { S: 'AR' },
                            transactionId: { S: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' },
                          },
                          SequenceNumber: '4136500000000007589800824',
                          SizeBytes: 372,
                          StreamViewType: 'NEW_IMAGE',
                        },
          eventSourceARN: 'arn:aws:dynamodb:us-east-1:583081784313:table/devOrderHistoryToUpsert/stream/2021-01-05T14:05:45.609',
        },
      ],
    };

    const getTableName = jest.fn().mockResolvedValue({ tableNameError: 'UpsertOrderHistoryErrors' });

    const awsRepositories = { Repository: { get: jest.fn().mockRejectedValue({ ok: false }) } };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { getOrderHistory } = handler({ awsRepositories, getTableName, res });
    await getOrderHistory(event);

    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'UpsertOrderHistoryErrors',
        { transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a671' },
      ],
    ]);

    expect(res.success.mock.calls).toEqual([]);

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