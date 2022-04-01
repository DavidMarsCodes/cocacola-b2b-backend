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

    const getTableName = jest.fn().mockResolvedValue({ tableNameError: 'devUpsertSuggestedProductErrors' });

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
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

    const { getSuggestedProductResponseStatus } = handler({ awsRepositories, getTableName, getErpConfig, erpManager, res });
    await getSuggestedProductResponseStatus(event);

    expect(getTableName.mock.calls).toEqual([ [ ] ]);

    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devUpsertSuggestedProductErrors',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
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
            {},
          ],
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
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

    const getTableName = jest.fn().mockResolvedValue({ tableNameError: 'devUpsertSuggestedProductErrors' });

    const awsRepositories = { Repository: { get: jest.fn().mockRejectedValue(false) } };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { getSuggestedProductResponseStatus } = handler({ awsRepositories, getTableName, res });
    const result = await getSuggestedProductResponseStatus(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devUpsertSuggestedProductErrors',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);

    expect(res.success.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        'false',
      ],
    ]);

  });

});