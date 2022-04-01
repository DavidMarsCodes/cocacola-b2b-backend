const handlerDiscount = require('../lambda');
const { discountsMock } = require('./__mock__/discount');

describe('GetDiscount Lamda Function', () => {
  it('Request the data of all discount.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      organizationId: '3043',
      clientId: 2,
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
      deliverydate: '2021-01-14',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const discounts = discountsMock;

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getAll: jest.fn().mockResolvedValue({
          discounts,
          count: 3,
          currentPage: 1,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });
    const discountsHandler = {
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
      processDiscounts: jest.fn().mockReturnValue(discounts),
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      clientDataLoaded: { get: jest.fn().mockResolvedValue(true) },
      clientDiscount: {
        getByDeliveryDate: jest.fn().mockResolvedValue(discounts),
        get: jest.fn().mockResolvedValue({}),
      },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          pricesDate: '2021-09-02T00:00:00.000Z',
        }),
      },
    });

    const experts = {
      discount: {
        validateDiscountPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateDiscountGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
        priceDateByCountry: jest.fn(),
      },
      order: {
        hasDataLoaded: jest.fn().mockReturnValue(),
        hasOperationDates: jest.fn(),
      },
    };


    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: portfolio,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
            paramId: '001-AR-3046',
            params: {
              DATE_FOR_OPERATIONS: 'DELIVERY_DATE',
              ROUND_PRESICION: '2',
            },
          },
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'Parameters' });

    const taxes = { calculateDiscountTaxes: jest.fn().mockResolvedValue([]) };

    const rounding = { discount: { applyRounds: jest.fn().mockReturnValue({}) } };

    const { Order, closeConnection } = await repositories();
    const result = await handlerDiscount({ accessControl, experts, res, dbRedis, repositories, discountsHandler, awsRepositories, getTableName, rounding, taxes }).getDiscountService(event);

    expect(experts.discount.validateDiscountGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          organizationId: '3043',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          clientId: 2,
          cpgId: 1,
          countryId: 'AR',
          offset: 0,
          limit: 3,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
        },
      ],
    ]);
    expect(experts.discount.isValidDate.mock.calls).toEqual([
      [
        event.deliverydate,
      ],
    ]);
    expect(experts.discount.validateExistsResult.mock.calls).toEqual([
      [ discounts ],
    ]);
    expect(experts.order.hasDataLoaded.mock.calls).toEqual([
      [
        true,
      ],
    ]);
    expect(taxes.calculateDiscountTaxes.mock.calls).toEqual([
      [
        [],
        Order,
        2,
        '2021-09-02T00:00:00.000Z',
      ],
    ]);
    expect(rounding.discount.applyRounds.mock.calls).toEqual([
      [
        [],
        '2',
      ],
    ]);

    expect(res.success.mock.calls).toEqual([
      [
        [],
        200,
      ],
    ]);
    expect(result).toEqual({
      code: 200,
      data: [],
      httpStatus: 200,
      ok: true,
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      organizationId: '3043',
      clientId: 2,
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const discounts = discountsMock;

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getAll: jest.fn().mockResolvedValue({
          discounts,
          count: 3,
          currentPage: 1,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const discountsHandler = {
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
      processDiscounts: jest.fn().mockReturnValue(discounts),
      roundDiscounts: jest.fn(),
    };


    const dbRedis = jest.fn().mockResolvedValue({
      clientDataLoaded: { get: jest.fn().mockResolvedValue(true) },
      clientDiscount: { getByDeliveryDate: jest.fn().mockResolvedValue(discounts) },
      operationDates: { get: jest.fn().mockRejectedValue(true) },
    });


    const experts = {
      discount: {
        validateDiscountPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateDiscountGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
      },
      order: {
        hasDataLoaded: jest.fn().mockReturnValue(),
        hasOperationDates: jest.fn(),
      },

    };

    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: portfolio,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const awsRepositories = { Repository: { get: jest.fn() } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'Parameters' });

    const taxes = { calculateDiscountTaxes: jest.fn().mockResolvedValue([]) };

    const rounding = { discount: { applyRounds: jest.fn().mockReturnValue({}) } };

    const { Order, closeConnection } = await repositories();
    const result = await handlerDiscount({ accessControl, experts, res, dbRedis, discountsHandler, repositories, awsRepositories, getTableName, taxes, rounding }).getDiscountService(event);

    expect(experts.discount.validateDiscountGetAllRequiredParams.mock.calls).toEqual([]);
    expect(experts.discount.isValidDate.mock.calls).toEqual([]);
    expect(experts.order.hasDataLoaded.mock.calls).toEqual([]);

    expect(experts.discount.validateExistsResult.mock.calls).toEqual([]);
    expect(taxes.calculateDiscountTaxes.mock.calls).toEqual([]);
    expect(rounding.discount.applyRounds.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'Server_Error',
        500,
      ],
    ]);
    expect(result).toEqual({
      code: 1001,
      errorType: 'Not Found',
      httpStatus: 404,
      message: 'descripcion del error',
      ok: true,
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      organizationId: '3043',
      clientId: 2,
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const discounts = discountsMock;
    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getAll: jest.fn().mockResolvedValue({
          discounts,
          count: 3,
          currentPage: 1,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const discountsHandler = {
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
      processDiscounts: jest.fn().mockReturnValue(discounts),
      roundDiscounts: jest.fn(),
    };


    const dbRedis = jest.fn().mockResolvedValue({
      clientDataLoaded: { get: jest.fn().mockResolvedValue(true) },
      clientDiscount: { getByDeliveryDate: jest.fn().mockResolvedValue(discounts) },
      operationDates: { get: jest.fn().mockResolvedValue(true) },
    });

    const experts = {
      discount: {
        validateDiscountPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateDiscountGetAllRequiredParams: jest.fn(() => {
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
        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
      },
      order: {
        hasDataLoaded: jest.fn().mockReturnValue(),
        hasOperationDates: jest.fn(),
      },

    };


    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: portfolio,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const awsRepositories = { Repository: { get: jest.fn() } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'Parameters' });

    const taxes = { calculateDiscountTaxes: jest.fn().mockResolvedValue([]) };

    const rounding = { discount: { applyRounds: jest.fn().mockReturnValue({}) } };

    const { Order, closeConnection } = await repositories();
    const result = await handlerDiscount({ accessControl, experts, res, dbRedis, discountsHandler, repositories, awsRepositories, getTableName, taxes, rounding }).getDiscountService(event);

    expect(experts.discount.validateDiscountGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          organizationId: '3043',
          clientId: 2,
          cpgId: 1,
          countryId: 'AR',
          offset: 0,
          limit: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.discount.isValidDate.mock.calls).toEqual([]);

    expect(experts.discount.validateExistsResult.mock.calls).toEqual([]);
    expect(experts.order.hasDataLoaded.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'invalid_cpg',
        500,
        'validation-error',
        400,
      ],
    ]);
    expect(result).toEqual({
      code: 1001,
      errorType: 'Not Found',
      httpStatus: 404,
      message: 'descripcion del error',
      ok: true,
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case the flag is not found in redis', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      organizationId: '3043',
      clientId: 2,
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
      deliverydate: '2021-01-14',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const discounts = discountsMock;

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getAll: jest.fn().mockResolvedValue({
          discounts,
          count: 3,
          currentPage: 1,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });
    const discountsHandler = {
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
      processDiscounts: jest.fn().mockReturnValue(discounts),
      calculateDiscountTaxes: jest.fn().mockReturnValue(discounts),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      clientDataLoaded: { get: jest.fn().mockResolvedValue(undefined) },
      clientDiscount: {
        getByDeliveryDate: jest.fn().mockResolvedValue(discounts),
        get: jest.fn().mockResolvedValue({}),
      },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          pricesDate: '2021-09-02T00:00:00.000Z',
        }),
      },
    });

    const experts = {
      discount: {
        validateDiscountPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateDiscountGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
        priceDateByCountry: jest.fn(),
      },
      order: {
        hasDataLoaded: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'Discounts expired. Initialize the chart',
              code: 41,
              type: 'validation_error',
              httpStatus: 409,
            }),
          };
        }),
        hasOperationDates: jest.fn(),
      },
    };


    const res = {
      success: jest.fn((portfolio, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: portfolio,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 41,
        errorType: 'validation_error',
        message: 'Discounts expired. Initialize the chart',
      }),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
            paramId: '001-AR-3046',
            params: {
              DATE_FOR_OPERATIONS: 'DELIVERY_DATE',
              ROUND_PRESICION: '2',
            },
          },
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'Parameters' });

    const taxes = { calculateDiscountTaxes: jest.fn().mockResolvedValue([]) };

    const rounding = { discount: { applyRounds: jest.fn().mockReturnValue({}) } };

    const { Order, closeConnection } = await repositories();
    const result = await handlerDiscount({ accessControl, experts, res, dbRedis, repositories, discountsHandler, awsRepositories, getTableName, rounding, taxes }).getDiscountService(event);

    expect(experts.discount.validateDiscountGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          organizationId: '3043',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          clientId: 2,
          cpgId: 1,
          countryId: 'AR',
          offset: 0,
          limit: 3,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
        },
      ],
    ]);
    expect(experts.discount.isValidDate.mock.calls).toEqual([
      [
        event.deliverydate,
      ],
    ]);
    expect(experts.discount.validateExistsResult.mock.calls).toEqual([]);
    expect(experts.order.hasDataLoaded.mock.calls).toEqual([
      [
        undefined,
      ],
    ]);
    expect(taxes.calculateDiscountTaxes.mock.calls).toEqual([]);
    expect(rounding.discount.applyRounds.mock.calls).toEqual([]);

    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Discounts expired. Initialize the chart',
        41,
        'validation_error',
        409,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 404,
      ok: true,
      code: 41,
      errorType: 'validation_error',
      message: 'Discounts expired. Initialize the chart',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});