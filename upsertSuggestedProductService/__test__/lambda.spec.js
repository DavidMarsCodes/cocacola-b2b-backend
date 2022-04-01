const handlerSuggestedProducts = require('../lambda');

describe('InsertSuggestedProducts Lambda Function', () => {
  it('Should insert suggested products', async () => {
    const event = {
      Records: [
        { dynamodb: { NewImage: { transactionId: { S: '3077c231-c352-41eb-8aaf-2457022dae77' } } } },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            countryId: 'AR',
            cpgId: '001',
            organizationId: '3606',
            data: [ {
              erpClientId: 'ERP_DISCO',
              erpProductId: 'CC-R-1.0-VIDRIO',
              quantity: 0,
            } ],
          },
        }),
        create: jest.fn(),
      },
    };

    const experts = {
      client: { validateExistsResult: jest.fn().mockReturnValue(undefined) },
      product: {
        validateExistsResult: jest.fn().mockReturnValue(undefined),
        validateSuggestedProductItem: jest.fn().mockReturnValue(undefined),
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      SuggestedProduct: {
        create: jest.fn().mockResolvedValue({}),
        deleteByClient: jest.fn().mockResolvedValue({}),
      },
      Client: { getByErpId: jest.fn().mockResolvedValue({ client: { clientId: 123 } }) },
      Product: { getByErpId: jest.fn().mockResolvedValue({ productId: 1 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devSuggestedProductsToInsert',
      tableNameError: 'devInsertSuggestedProductErrors',
    });

    const buildSuggestedProductObject = jest.fn().mockReturnValue(
      {
        11111111111: [
          {
            erpClientId: 'ERP_DISCO',
            erpProductId: 'CC-R-1.0-VIDRIO',
            quantity: 0,
          },
        ],
      },
    );

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerSuggestedProducts({ awsRepositories, repositories, getTableName, experts, res, buildSuggestedProductObject }).insertSuggestedProducts(event);

    expect(getTableName.mock.calls).toEqual([
      [],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devSuggestedProductsToInsert',
        { transactionId: '3077c231-c352-41eb-8aaf-2457022dae77' },
      ],
    ]);
    expect(buildSuggestedProductObject.mock.calls).toEqual([
      [
        [
          {
            erpClientId: 'ERP_DISCO',
            erpProductId: 'CC-R-1.0-VIDRIO',
            quantity: 0,
          },
        ],
      ],
    ]);
    const { SuggestedProduct, Client, Product, closeConnection } = await repositories();
    expect(Client.getByErpId.mock.calls).toEqual([
      [
        '11111111111',
        {
          clientId: 123,
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3606',
          productId: 1,
        },
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { client: { clientId: 123 } },
      ],
    ]);
    expect(experts.product.validateSuggestedProductItem.mock.calls).toEqual([
      [
        {
          erpClientId: 'ERP_DISCO',
          erpProductId: 'CC-R-1.0-VIDRIO',
          quantity: 0,
        },
      ],
    ]);
    expect(Product.getByErpId.mock.calls).toEqual([
      [
        'CC-R-1.0-VIDRIO',
        {
          clientId: 123,
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3606',
          productId: 1,
        },
      ],
    ]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([
      [
        { productId: 1 },
      ],
    ]);
    expect(SuggestedProduct.deleteByClient.mock.calls).toEqual([
      [
        {
          clientId: 123,
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3606',
          productId: 1,
        },
      ],
    ]);
    expect(SuggestedProduct.create.mock.calls).toEqual([
      [
        {
          erpClientId: 'ERP_DISCO',
          erpProductId: 'CC-R-1.0-VIDRIO',
          quantity: 0,
        },
        {
          clientId: 123,
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3606',
          productId: 1,
        },
      ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      Records: [
        { dynamodb: { NewImage: { transactionId: { S: '3077c231-c352-41eb-8aaf-2457022dae77' } } } },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            countryId: 'AR',
            cpgId: '001',
            organizationId: '3606',
            data: [ {
              erpClientId: 'ERP_DISCO',
              erpProductId: 'CC-R-1.0-VIDRIO',
              quantity: 0,
            } ],
          },
        }),
        create: jest.fn(),
      },
    };

    const experts = {
      client: {
        validateExistsResult: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'client_not_found',
              type: 'Validation_error',
            }),
          };
        }),
      },
      product: {
        validateExistsResult: jest.fn().mockReturnValue(undefined),
        validateSuggestedProductItem: jest.fn().mockReturnValue(undefined),
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      SuggestedProduct: {
        create: jest.fn().mockResolvedValue({}),
        deleteByClient: jest.fn().mockResolvedValue({}),
      },
      Client: { getByErpId: jest.fn().mockResolvedValue({ client: { clientId: 123 } }) },
      Product: { getByErpId: jest.fn().mockResolvedValue({ productId: 1 }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devSuggestedProductsToInsert',
      tableNameError: 'devInsertSuggestedProductErrors',
    });

    const buildSuggestedProductObject = jest.fn().mockReturnValue(
      {
        11111111111: [
          {
            erpClientId: 'ERP_DISCO',
            erpProductId: 'CC-R-1.0-VIDRIO',
            quantity: 0,
          },
        ],
      },
    );

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerSuggestedProducts({ awsRepositories, repositories, getTableName, experts, res, buildSuggestedProductObject }).insertSuggestedProducts(event);

    expect(getTableName.mock.calls).toEqual([
      [],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devSuggestedProductsToInsert',
        { transactionId: '3077c231-c352-41eb-8aaf-2457022dae77' },
      ],
    ]);

    const { SuggestedProduct, Client, Product, closeConnection } = await repositories();
    expect(Client.getByErpId.mock.calls).toEqual([
      [
        '11111111111',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3606',
        },
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        { client: { clientId: 123 } },
      ],
    ]);
    expect(Product.getByErpId.mock.calls).toEqual([ ]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([ ]);
    expect(SuggestedProduct.deleteByClient.mock.calls).toEqual([ ]);
    expect(experts.product.validateSuggestedProductItem.mock.calls).toEqual([]);
    expect(SuggestedProduct.create.mock.calls).toEqual([ ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'client_not_found',
        100,
        'Validation_error',
        400,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});