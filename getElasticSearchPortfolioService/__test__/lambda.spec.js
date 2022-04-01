const handlerPortafolio = require('../lambda');

describe('getElasticSearchPortfolio Lamda Function', () => {
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const experts = {
      order: { hasOperationDates: jest.fn() },
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: '0',
          limit: '24',
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(),
      },
    };


    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };

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

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

    const environment = 'dev';

    const Mapper = { portfolioMap: jest.fn().mockReturnValue({}) };

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

    const { getElasticSearchPortfolio } = handlerPortafolio({ accessControl, experts, dbRedis, elasticSearchRepositories, connection, Query, getElasticSearchIndex, environment, Mapper, res });
    await getElasticSearchPortfolio(event);

    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [
        '0',
        '24',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);

    expect(experts.order.hasOperationDates.mock.calls).toEqual([
      [
        { pricesDate: '2021-02-06T00:00:00.000Z' },
        {
          operationDates: { pricesDate: '2021-02-06T00:00:00.000Z' },
          message: `No 'Operation Dates' were found for user: 3077c231-c352-41eb-8aaf-2457022dae77`,
        },
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
        '0',
        '24',
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
          brand: '',
          clientId: '2',
          countryId: 'AR',
          cpgId: '001',
          deliverydate: '2021-02-06T00:00:00.000Z',
          index: 'portfolio-product',
          label: '',
          limit: '24',
          offset: '0',
          organizationId: '3048',
          package: '',
          returnability: '',
          size: '',
          text: '',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
        },
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([
      [
        '',
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([
      [],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([
      [],
    ]);
    expect(getElasticSearchIndex.mock.calls).toEqual([
      [],
    ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
    ]);
    expect(Mapper.portfolioMap.mock.calls).toEqual([
      [
        {
          hits: {
            total: { value: 429 },
            hits: [],
          },
        },
      ],
    ]);

    expect(res.success).toHaveBeenCalled();
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const experts = {
      order: { hasOperationDates: jest.fn() },
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: '0',
          limit: '24',
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(),
      },
    };


    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const connection = { initElasticSearchConnection: jest.fn().mockRejectedValue({}) };

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

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

    const environment = 'dev';

    const Mapper = { portfolioMap: jest.fn().mockReturnValue({}) };

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

    const { getElasticSearchPortfolio } = handlerPortafolio({ accessControl, experts, dbRedis, elasticSearchRepositories, connection, Query, getElasticSearchIndex, environment, Mapper, res });
    await getElasticSearchPortfolio(event);

    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [
        '0',
        '24',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);
    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
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
    expect(getElasticSearchIndex.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(Mapper.portfolioMap.mock.calls).toEqual([]);
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const experts = {
      order: { hasOperationDates: jest.fn() },
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: '0',
          limit: '24',
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(),
      },
    };


    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };

    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockRejectedValue({}) }) };

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

    const environment = 'dev';

    const Mapper = { portfolioMap: jest.fn().mockReturnValue({}) };

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

    const { getElasticSearchPortfolio } = handlerPortafolio({ accessControl, experts, dbRedis, elasticSearchRepositories, connection, Query, getElasticSearchIndex, environment, Mapper, res });
    await getElasticSearchPortfolio(event);

    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [
        '0',
        '24',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
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
        '0',
        '24',
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
          brand: '',
          clientId: '2',
          countryId: 'AR',
          cpgId: '001',
          deliverydate: '2021-02-06T00:00:00.000Z',
          index: 'portfolio-product',
          label: '',
          limit: '24',
          offset: '0',
          organizationId: '3048',
          package: '',
          returnability: '',
          size: '',
          text: '',
          transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
        },
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm().setFullText.mock.calls).toEqual([
      [
        '',
      ],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText().setSort.mock.calls).toEqual([
      [],
    ]);
    expect(Query().setPagination()
      .setRange()
      .setTerm()
      .setFullText()
      .setSort().build.mock.calls).toEqual([
      [],
    ]);
    expect(getElasticSearchIndex.mock.calls).toEqual([
      [],
    ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
    ]);
    expect(Mapper.portfolioMap.mock.calls).toEqual([]);
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const experts = {
      order: { hasOperationDates: jest.fn() },
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: '0',
          limit: '24',
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
      },
    };


    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };

    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockRejectedValue({}) }) };

    const Query = jest.fn().mockReturnValue({ setPagination: jest.fn().mockReturnValue({ setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setSort: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

    const environment = 'dev';

    const Mapper = { portfolioMap: jest.fn().mockReturnValue({}) };

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

    const { getElasticSearchPortfolio } = handlerPortafolio({ accessControl, experts, dbRedis, elasticSearchRepositories, connection, Query, getElasticSearchIndex, environment, Mapper, res });
    await getElasticSearchPortfolio(event);

    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
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
          returnability: '',
          label: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([]);
    expect(accessControl.getSessionData.mock.calls).toEqual([]);
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
    expect(getElasticSearchIndex.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(Mapper.portfolioMap.mock.calls).toEqual([]);
    expect(res.success).not.toHaveBeenCalled();
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
        100,
        'Validation_error',
        400,
      ],
    ]);
  });
});
