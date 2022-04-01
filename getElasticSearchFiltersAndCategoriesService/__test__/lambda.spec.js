const handlerFiltersAndCategories = require('../lambda');

describe('getElasticSearchFiltersAndCategories Lamda Function', () => {
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
    const elasticSearchRepositories = {
      Read: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          aggregations: {
            brands: {
              buckets: [
                {
                  key: 'Coca-Cola',
                  doc_count: 3,
                },
                {
                  key: 'Coca-Cola Zero',
                  doc_count: 3,
                },
              ],
            },
            sizes: {
              buckets: [
                {
                  key: '1.5 LTR',
                  doc_count: 10,
                },
                {
                  key: '300 ML',
                  doc_count: 5,
                },
              ],
            },
            packages: {
              buckets: [
                {
                  key: 'Wax Paperboard Brick Pack',
                  doc_count: 36,
                },
                {
                  key: 'Tetra Pak',
                  doc_count: 5,
                },
              ],
            },
            categories: {
              buckets: [
                {
                  key: 'Sin categoria',
                  doc_count: 41,
                },
              ],
            },
            returnabilities: {
              buckets: [
                {
                  key: 0,
                  key_as_string: 'false',
                  doc_count: 0,
                },
                {
                  key: 1,
                  key_as_string: 'true',
                  doc_count: 0,
                },
              ],
            },
          },
        }),
      }),
    };
    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };
    const experts = {
      suggestedProduct: { priceDateByCountry: jest.fn().mockReturnValue({}) },
      portfolio: {
        validatePortfolioGetLabelRequiredParams: jest.fn().mockReturnValue({}),
        validationRequiredParamsGetFilter: jest.fn().mockReturnValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };
    const Query = jest.fn().mockReturnValue({
      setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setAggsBrand: jest.fn().mockReturnValue({ setAggsSize: jest.fn().mockReturnValue({ setAggsPackages: jest.fn().mockReturnValue({ setAggsReturnability: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) })}),
      setTerm: jest.fn().mockReturnValue({ setAggsCategories: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }),
    });
    const Filter = jest.fn().mockReturnValue({
      brandsMap: jest.fn().mockReturnValue({ sizesMap: jest.fn().mockReturnValue({ packagesMap: jest.fn().mockReturnValue({ returnabilityMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }) }) }) }),
      categoriesMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }),
    });

    const environment = 'dev';

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

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
      status: jest.fn().mockReturnValue({
        json: jest.fn().mockReturnValue({
          httpStatus: 201,
          data: {},
        }),
      }),
    };


    const { getElasticSearchFiltersAndCategories } = handlerFiltersAndCategories({ accessControl, dbRedis, elasticSearchRepositories, getElasticSearchIndex, connection, experts, Query, environment, Filter, res });
    await getElasticSearchFiltersAndCategories(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioGetLabelRequiredParams.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
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
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(Query.mock.calls).toEqual([ [], [] ]);
    expect(Query().setRange.mock.calls).toEqual([
      [
        '2021-02-06T00:00:00.000Z',
      ],
    ]);
    expect(Query().setRange().setTerm.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(Query().setRange()
      .setTerm().setFullText.mock.calls).toEqual([ [ '' ] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText().setAggsBrand.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand().setAggsSize.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize().setAggsPackages.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages().setAggsReturnability.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages()
      .setAggsReturnability().build.mock.calls).toEqual([ [] ]);
    expect(Query().setTerm.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(Query().setTerm().setAggsCategories.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
    ]);
    expect(Filter.mock.calls).toEqual([ [ ], [ ] ]);
    expect(Filter().categoriesMap.mock.calls).toEqual([
      [
        [
          {
            doc_count: 41,
            key: 'Sin categoria',
          },
        ],
      ],
    ]);
    expect(Filter().categoriesMap().getFilter.mock.calls).toEqual([ [] ]);
    expect(Filter().brandsMap.mock.calls).toEqual([
      [
        [
          {
            doc_count: 3,
            key: 'Coca-Cola',
          },
          {
            doc_count: 3,
            key: 'Coca-Cola Zero',
          },
        ],
      ],
    ]);
    expect(Filter().brandsMap().sizesMap.mock.calls).toEqual([
      [
        [
          {
            doc_count: 10,
            key: '1.5 LTR',
          },
          {
            doc_count: 5,
            key: '300 ML',
          },
        ],
      ],
    ]);
    expect(Filter().brandsMap()
      .sizesMap().packagesMap.mock.calls).toEqual([
      [
        [
          {
            doc_count: 36,
            key: 'Wax Paperboard Brick Pack',
          },
          {
            doc_count: 5,
            key: 'Tetra Pak',
          },
        ],
      ],
    ]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap().returnabilityMap.mock.calls).toEqual([
      [
        [
          {
            doc_count: 0,
            key: 0,
            key_as_string: 'false',
          },
          {
            doc_count: 0,
            key: 1,
            key_as_string: 'true',
          },
        ],
      ],
    ]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap()
      .returnabilityMap().getFilter.mock.calls).toEqual([ [ ] ]);
    expect(res.status.mock.calls).toEqual([
      [
        200,
      ],
    ]);
    expect(res.status().json.mock.calls).toEqual([
      [
        {},
      ],
    ]);
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };
    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue({}) }) };
    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue() };
    const experts = {
      suggestedProduct: { priceDateByCountry: jest.fn().mockResolvedValue({}) },
      portfolio: {
        validatePortfolioGetLabelRequiredParams: jest.fn(() => {
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
        validationRequiredParamsGetFilter: jest.fn().mockReturnValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };
    const Query = jest.fn().mockReturnValue({
      setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setAggsBrand: jest.fn().mockReturnValue({ setAggsSize: jest.fn().mockReturnValue({ setAggsPackages: jest.fn().mockReturnValue({ setAggsReturnability: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) })}),
      setTerm: jest.fn().mockReturnValue({ setAggsCategories: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }),
    });
    const Filter = jest.fn().mockReturnValue({
      brandsMap: jest.fn().mockReturnValue({ sizesMap: jest.fn().mockReturnValue({ packagesMap: jest.fn().mockReturnValue({ returnabilityMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }) }) }) }),
      categoriesMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }),
    });
    const environment = 'dev';

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

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
      status: jest.fn().mockReturnValue({
        json: jest.fn().mockReturnValue({
          httpStatus: 201,
          data: {},
        }),
      }),
    };


    const { getElasticSearchFiltersAndCategories } = handlerFiltersAndCategories({ accessControl, dbRedis, elasticSearchRepositories, getElasticSearchIndex, connection, experts, Query, environment, Filter, res });
    await getElasticSearchFiltersAndCategories(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioGetLabelRequiredParams.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([]);
    expect(experts.suggestedProduct.priceDateByCountry.mock.calls).toEqual([]);
    expect(dbRedis.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([]);
    expect(connection.initElasticSearchConnection.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([]);
    expect(Query.mock.calls).toEqual([]);
    expect(Query().setRange.mock.calls).toEqual([]);
    expect(Query().setRange().setTerm.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm().setFullText.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText().setAggsBrand.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand().setAggsSize.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize().setAggsPackages.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages().setAggsReturnability.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages()
      .setAggsReturnability().build.mock.calls).toEqual([]);
    expect(Query().setTerm.mock.calls).toEqual([]);
    expect(Query().setTerm().setAggsCategories.mock.calls).toEqual([]);
    expect(getElasticSearchIndex.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(Filter.mock.calls).toEqual([]);
    expect(Filter().categoriesMap.mock.calls).toEqual([]);
    expect(Filter().categoriesMap().getFilter.mock.calls).toEqual([]);
    expect(Filter().brandsMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap().sizesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap().packagesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap().returnabilityMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap()
      .returnabilityMap().getFilter.mock.calls).toEqual([]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
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
      b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    };
    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue({}) }) };
    const connection = { initElasticSearchConnection: jest.fn().mockRejectedValue({}) };
    const experts = {
      suggestedProduct: { priceDateByCountry: jest.fn().mockReturnValue({}) },
      portfolio: {
        validatePortfolioGetLabelRequiredParams: jest.fn().mockReturnValue({}),
        validationRequiredParamsGetFilter: jest.fn().mockReturnValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };
    const Query = jest.fn().mockReturnValue({
      setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setAggsBrand: jest.fn().mockReturnValue({ setAggsSize: jest.fn().mockReturnValue({ setAggsPackages: jest.fn().mockReturnValue({ setAggsReturnability: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) })}),
      setTerm: jest.fn().mockReturnValue({ setAggsCategories: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }),
    });
    const Filter = jest.fn().mockReturnValue({
      brandsMap: jest.fn().mockReturnValue({ sizesMap: jest.fn().mockReturnValue({ packagesMap: jest.fn().mockReturnValue({ returnabilityMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }) }) }) }),
      categoriesMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }),
    });

    const environment = 'dev';

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

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
      status: jest.fn().mockReturnValue({
        json: jest.fn().mockReturnValue({
          httpStatus: 201,
          data: {},
        }),
      }),
    };


    const { getElasticSearchFiltersAndCategories } = handlerFiltersAndCategories({ accessControl, dbRedis, elasticSearchRepositories, getElasticSearchIndex, connection, experts, Query, environment, Filter, res });
    await getElasticSearchFiltersAndCategories(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioGetLabelRequiredParams.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
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
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(Query.mock.calls).toEqual([]);
    expect(Query().setRange.mock.calls).toEqual([]);
    expect(Query().setRange().setTerm.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm().setFullText.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText().setAggsBrand.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand().setAggsSize.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize().setAggsPackages.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages().setAggsReturnability.mock.calls).toEqual([]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages()
      .setAggsReturnability().build.mock.calls).toEqual([]);
    expect(Query().setTerm.mock.calls).toEqual([]);
    expect(Query().setTerm().setAggsCategories.mock.calls).toEqual([]);
    expect(getElasticSearchIndex.mock.calls).toEqual([]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([]);
    expect(Filter.mock.calls).toEqual([]);
    expect(Filter().categoriesMap.mock.calls).toEqual([]);
    expect(Filter().categoriesMap().getFilter.mock.calls).toEqual([]);
    expect(Filter().brandsMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap().sizesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap().packagesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap().returnabilityMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap()
      .returnabilityMap().getFilter.mock.calls).toEqual([]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
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
    const elasticSearchRepositories = { Read: jest.fn().mockReturnValue({ get: jest.fn().mockRejectedValue({}) }) };
    const connection = { initElasticSearchConnection: jest.fn().mockResolvedValue({}) };
    const experts = {
      suggestedProduct: { priceDateByCountry: jest.fn().mockReturnValue({}) },
      portfolio: {
        validatePortfolioGetLabelRequiredParams: jest.fn().mockReturnValue({}),
        validationRequiredParamsGetFilter: jest.fn().mockReturnValue({}),
      },
      order: { hasOperationDates: jest.fn() },
    };
    const Query = jest.fn().mockReturnValue({
      setRange: jest.fn().mockReturnValue({ setTerm: jest.fn().mockReturnValue({ setFullText: jest.fn().mockReturnValue({ setAggsBrand: jest.fn().mockReturnValue({ setAggsSize: jest.fn().mockReturnValue({ setAggsPackages: jest.fn().mockReturnValue({ setAggsReturnability: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }) }) }) }) })}),
      setTerm: jest.fn().mockReturnValue({ setAggsCategories: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({}) }) }),
    });
    const Filter = jest.fn().mockReturnValue({
      brandsMap: jest.fn().mockReturnValue({ sizesMap: jest.fn().mockReturnValue({ packagesMap: jest.fn().mockReturnValue({ returnabilityMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }) }) }) }),
      categoriesMap: jest.fn().mockReturnValue({ getFilter: jest.fn().mockReturnValue({}) }),
    });

    const environment = 'dev';

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '3077c231-c352-41eb-8aaf-2457022dae77' }),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      operationDates: { get: jest.fn().mockResolvedValue({ pricesDate: '2021-02-06T00:00:00.000Z' }) },
      closeConnection: jest.fn(),
    });

    const getElasticSearchIndex = jest.fn().mockResolvedValue('portfolio');

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
      status: jest.fn().mockReturnValue({
        json: jest.fn().mockReturnValue({
          httpStatus: 201,
          data: {},
        }),
      }),
    };


    const { getElasticSearchFiltersAndCategories } = handlerFiltersAndCategories({ accessControl, dbRedis, elasticSearchRepositories, getElasticSearchIndex, connection, experts, Query, environment, Filter, res });
    await getElasticSearchFiltersAndCategories(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        '2',
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
    ]);
    expect(experts.portfolio.validatePortfolioGetLabelRequiredParams.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
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
          label: '',
          returnability: '',
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(connection.initElasticSearchConnection.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(Query.mock.calls).toEqual([ [], [] ]);
    expect(Query().setRange.mock.calls).toEqual([
      [
        '2021-02-06T00:00:00.000Z',
      ],
    ]);
    expect(Query().setRange().setTerm.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(Query().setRange()
      .setTerm().setFullText.mock.calls).toEqual([ [ '' ] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText().setAggsBrand.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand().setAggsSize.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize().setAggsPackages.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages().setAggsReturnability.mock.calls).toEqual([ [] ]);
    expect(Query().setRange()
      .setTerm()
      .setFullText()
      .setAggsBrand()
      .setAggsSize()
      .setAggsPackages()
      .setAggsReturnability().build.mock.calls).toEqual([ [] ]);
    expect(Query().setTerm.mock.calls).toEqual([
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
          b2bSession: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        },
      ],
    ]);
    expect(Query().setTerm().setAggsCategories.mock.calls).toEqual([ [] ]);
    expect(elasticSearchRepositories.Read().get.mock.calls).toEqual([
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
      [
        'dev-portfolio-001-3048-ar',
        {},
      ],
    ]);
    expect(Filter.mock.calls).toEqual([]);
    expect(Filter().categoriesMap.mock.calls).toEqual([]);
    expect(Filter().categoriesMap().getFilter.mock.calls).toEqual([]);
    expect(Filter().brandsMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap().sizesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap().packagesMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap().returnabilityMap.mock.calls).toEqual([]);
    expect(Filter().brandsMap()
      .sizesMap()
      .packagesMap()
      .returnabilityMap().getFilter.mock.calls).toEqual([]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.status().json.mock.calls).toEqual([]);
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