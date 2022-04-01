const handlerSuggestedProduct = require('../lambda');

describe('getElasticSearchSuggestedProduct Lamda Function', () => {
  it('Request the filtered data for elasticSearch', async () => {
    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3048',
      transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
      clientId: '2',
      deliverydate: '2021-02-06T00:00:00.000Z',
      offset: '0',
      limit: '24',
      text: '',
      package: '',
      index: 'portfolio-product',
      size: '',
      brand: '',
      returnability: '',
      label: '',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674' }),
    };

    const elasticSearchRepositories = {
      Read: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          hits: {
            total: { value: 429 },
            hits: [],
          },
        }),
      }),
    };

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      suggestedProduct: {
        validateSuggestedProductGetAllRequiredParams: jest.fn().mockReturnValue({}),
        validateSuggestedProductPaginationParams: jest.fn().mockReturnValue({
          offset: 0,
          limit: 24,
        }),
        hasSuggestedProducts: jest.fn(),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio-product');

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });
    const translate = { suggestedProducts: jest.fn().mockReturnValue({}) };

    const environment = 'environmentTast';

    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: event,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getElasticSearchSuggestedProduct } = handlerSuggestedProduct({ accessControl, elasticSearchRepositories, connection, dbRedis, experts, Query, getElasticSearchIndex, environment, translate, res });
    await getElasticSearchSuggestedProduct(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '2',
      ],
    ]);

    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(dbRedis.mock.calls).toEqual([ [] ]);

    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(experts.suggestedProduct.validateSuggestedProductPaginationParams.mock.calls).toEqual([
      [
        '0', '24',
      ],
    ]);

    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(Query.mock.calls).toEqual([ [] ]);
    expect(Query().setPagination.mock.calls).toEqual([
      [
        0,
        24,
      ],
    ]);
    expect(Query().setPagination().setRange.mock.calls).toEqual([
      [
        '2021-02-06T00:00:00.000Z',
      ],
    ]);
    expect(Query().setPagination()
      .setRange().setTerm.mock.calls).toEqual([
      [
        {
          brand: '',
          clientId: '2',
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3048',
          deliverydate: '2021-02-06T00:00:00.000Z',
          index: 'portfolio-product',
          label: '',
          limit: '24',
          offset: '0',
          package: '',
          returnability: '',
          size: '',
          text: '',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([ [ '' ] ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([ [] ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'environmentTast-portfolio-product-001-3048-ar',
        {},
      ],
    ]);
    expect(translate.suggestedProducts.mock.calls).toEqual([
      [
        {
          hits: {
            total: { value: 429 },
            hits: [],
          },
        },
      ],
    ]);

    expect(experts.suggestedProduct.hasSuggestedProducts).toHaveBeenCalled();

    expect(res.success).toHaveBeenCalled();
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3048',
      transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
      clientId: '2',
      deliverydate: '2021-02-06T00:00:00.000Z',
      offset: '0',
      limit: '24',
      text: '',
      package: '',
      index: 'portfolio-product',
      size: '',
      brand: '',
      returnability: '',
      label: '',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674' }),
    };

    const elasticSearchRepositories = {
      Read: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          hits: {
            total: { value: 429 },
            hits: [],
          },
        }),
      }),
    };

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue() };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio-product');

    const experts = {
      suggestedProduct: {
        validateSuggestedProductGetAllRequiredParams: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 500,
              msg: 'invalid_cpg',
              type: 'validation-error',
            }),
          };
        }),
        validateSuggestedProductPaginationParams: jest.fn().mockResolvedValue({
          offset: 0,
          limit: 24,
        }),
        priceDateByCountry: jest.fn().mockResolvedValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };
    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });
    const translate = { suggestedProducts: jest.fn().mockReturnValue({}) };
    const environment = 'environmentTast';

    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: event,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getElasticSearchSuggestedProduct } = handlerSuggestedProduct({ accessControl, elasticSearchRepositories, connection, dbRedis, experts, Query, getElasticSearchIndex, environment, translate, res });
    await getElasticSearchSuggestedProduct(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '2',
      ],
    ]);

    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductPaginationParams.mock.calls).toEqual([]);

    expect(dbRedis.mock.calls).toEqual([]);

    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([]);

    expect(redis.closeConnection.mock.calls).toEqual([]);

    expect(connection.initElasticSearchConnection.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([]);
    expect(Query.mock.calls).toEqual([]);
    expect(Query().setPagination.mock.calls).toEqual([]);
    expect(Query().setPagination().setRange.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange().setTerm.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(translate.suggestedProducts.mock.calls).toEqual([]);
    expect(res.success).not.toHaveBeenCalled();
    expect(res.error.mock.calls).toEqual([
      [
        'invalid_cpg',
        500,
        'validation-error',
        400,
      ],
    ]);
  });

  it('It should return an error by default in case the ElasticSearch Connection fails.', async () => {
    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3048',
      transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
      clientId: '2',
      deliverydate: '2021-02-06T00:00:00.000Z',
      offset: '0',
      limit: '24',
      text: '',
      package: '',
      index: 'portfolio-product',
      size: '',
      brand: '',
      returnability: '',
      label: '',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674' }),
    };

    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue({}) }) };

    const connection = { initElasticSearchConnection: jest.fn().mockRejectedValue({}) };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio-product');

    const experts = {
      suggestedProduct: {
        validateSuggestedProductGetAllRequiredParams: jest.fn().mockResolvedValue({}),
        validateSuggestedProductPaginationParams: jest.fn().mockResolvedValue({
          offset: 0,
          limit: 24,
        }),
        priceDateByCountry: jest.fn().mockResolvedValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const translate = { suggestedProducts: jest.fn().mockReturnValue({}) };

    const environment = 'environmentTast';

    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: event,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getElasticSearchSuggestedProduct } = handlerSuggestedProduct({ accessControl, elasticSearchRepositories, connection, dbRedis, experts, Query, getElasticSearchIndex, environment, translate, res });
    await getElasticSearchSuggestedProduct(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '2',
      ],
    ]);

    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductPaginationParams.mock.calls).toEqual([
      [
        '0', '24',
      ],
    ]);

    expect(dbRedis.mock.calls).toEqual([ [] ]);

    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(Query.mock.calls).toEqual([]);
    expect(Query().setPagination.mock.calls).toEqual([]);
    expect(Query().setPagination().setRange.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange().setTerm.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(translate.suggestedProducts.mock.calls).toEqual([]);
    expect(res.success).not.toHaveBeenCalled();
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'Server_Error',
        500,
      ],
    ]);
  });

  it('It should return an error by default in case the query to ElasticSearch fails', async () => {
    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3048',
      transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
      clientId: '2',
      deliverydate: '2021-02-06T00:00:00.000Z',
      offset: '0',
      limit: '24',
      text: '',
      package: '',
      index: 'portfolio-product',
      size: '',
      brand: '',
      returnability: '',
      label: '',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674' }),
    };

    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockRejectedValue({}) }) };

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const experts = {
      suggestedProduct: {
        validateSuggestedProductGetAllRequiredParams: jest.fn().mockReturnValue({}),
        validateSuggestedProductPaginationParams: jest.fn().mockReturnValue({
          offset: 0,
          limit: 24,
        }),
        priceDateByCountry: jest.fn().mockReturnValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio-product');

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const translate = { suggestedProducts: jest.fn().mockReturnValue({}) };

    const environment = 'environmentTast';

    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: event,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const { getElasticSearchSuggestedProduct } = handlerSuggestedProduct({ accessControl, elasticSearchRepositories, connection, dbRedis, experts, Query, getElasticSearchIndex, environment, translate, res });
    await getElasticSearchSuggestedProduct(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '2',
      ],
    ]);

    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.suggestedProduct.validateSuggestedProductPaginationParams.mock.calls).toEqual([
      [
        '0', '24',
      ],
    ]);

    expect(dbRedis.mock.calls).toEqual([ [] ]);

    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3048',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          clientId: '2',
          deliverydate: '2021-02-06T00:00:00.000Z',
          offset: '0',
          limit: '24',
          text: '',
          package: '',
          index: 'portfolio-product',
          size: '',
          brand: '',
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(Query.mock.calls).toEqual([ [] ]);
    expect(Query().setPagination.mock.calls).toEqual([
      [
        0,
        24,
      ],
    ]);
    expect(Query().setPagination().setRange.mock.calls).toEqual([
      [
        '2021-02-06T00:00:00.000Z',
      ],
    ]);
    expect(Query().setPagination()
      .setRange().setTerm.mock.calls).toEqual([
      [
        {
          brand: '',
          clientId: '2',
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3048',
          deliverydate: '2021-02-06T00:00:00.000Z',
          index: 'portfolio-product',
          label: '',
          limit: '24',
          offset: '0',
          package: '',
          returnability: '',
          size: '',
          text: '',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([ [ '' ] ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([ [] ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'environmentTast-portfolio-product-001-3048-ar',
        {},
      ],
    ]);
    expect(translate.suggestedProducts.mock.calls).toEqual([]);
    expect(res.success).not.toHaveBeenCalled();
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'Server_Error',
        500,
      ],
    ]);
  });
});