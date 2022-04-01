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

    const getTableName = jest.fn().mockResolvedValue({
      tableNameError: 'devUpsertProductErrors',
      tableName: 'devProductToUpsert',
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockResolvedValue({
          Item: {
            data: [
              {
                name: 'Coca Cola 600 ml',
                erpProductId: 'PRODUCT-TEST-1',
                locked: false,
                availability: true,
                brand: 'coca cola',
                size: 'string',
                package: 'string',
                returnability: false,
                flavor: 'string',
                erpUnitMeasureId: 'string',
                unitMeasure: 'string',
                image: 'string',
              },
              {
                name: 'Coca Cola Vidrio 500 ml',
                erpProductId: 'PRODUCT-TEST-2',
                locked: false,
                availability: true,
                brand: 'string',
                size: 'string',
                package: 'string',
                returnability: false,
                flavor: 'string',
                erpUnitMeasureId: 'string',
                unitMeasure: 'string',
                image: 'string',
              },
            ],
            countryId: 'AR',
            cpgId: '001',
            organizationId: 3043,

          },
        }),
      },
    };

    const experts = { product: { validateCreateProductDateItem: jest.fn() } };

    const repositories = jest.fn().mockResolvedValue({
      Product: { upsert: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

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

    const { upsertProductService } = handler({ awsRepositories, repositories, getTableName, experts, res });
    await upsertProductService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devProductToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.product.validateCreateProductDateItem.mock.calls).toEqual([
      [
        {
          name: 'Coca Cola 600 ml',
          erpProductId: 'PRODUCT-TEST-1',
          locked: false,
          availability: true,
          brand: 'coca cola',
          size: 'string',
          package: 'string',
          returnability: false,
          flavor: 'string',
          erpUnitMeasureId: 'string',
          unitMeasure: 'string',
          image: 'string',
        },
      ],
      [
        {
          name: 'Coca Cola Vidrio 500 ml',
          erpProductId: 'PRODUCT-TEST-2',
          locked: false,
          availability: true,
          brand: 'string',
          size: 'string',
          package: 'string',
          returnability: false,
          flavor: 'string',
          erpUnitMeasureId: 'string',
          unitMeasure: 'string',
          image: 'string',
        },
      ],
    ]);

    const { Product, closeConnection } = await repositories();
    expect(Product.upsert.mock.calls).toEqual([
      [
        {
          name: 'Coca Cola 600 ml',
          erpProductId: 'PRODUCT-TEST-1',
          locked: false,
          availability: true,
          brand: 'coca cola',
          size: 'string',
          package: 'string',
          returnability: false,
          flavor: 'string',
          erpUnitMeasureId: 'string',
          unitMeasure: 'string',
          image: 'string',
        },
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: 3043,
        },
      ],
      [
        {
          name: 'Coca Cola Vidrio 500 ml',
          erpProductId: 'PRODUCT-TEST-2',
          locked: false,
          availability: true,
          brand: 'string',
          size: 'string',
          package: 'string',
          returnability: false,
          flavor: 'string',
          erpUnitMeasureId: 'string',
          unitMeasure: 'string',
          image: 'string',
        },
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: 3043,
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

    const getTableName = jest.fn().mockResolvedValue({
      tableNameError: 'devUpsertProductErrors',
      tableName: 'devProductToUpsert',
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockRejectedValue({ ok: false }),
      },
    };

    const experts = { product: { validateCreateProductDateItem: jest.fn() } };

    const repositories = jest.fn().mockResolvedValue({
      Product: { upsert: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

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

    const { upsertProductService } = handler({ awsRepositories, repositories, getTableName, experts, res });
    await upsertProductService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devProductToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    expect(experts.product.validateCreateProductDateItem.mock.calls).toEqual([]);

    const { Product, closeConnection } = await repositories();
    expect(Product.upsert.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });
});
