const handlerProducts = require('../lambda');
const { productsMocks } = require('./__mocks__/products');

describe('getProductsService Lambda', () => {
  it('Request all products', async () => {

    const offset = 1;
    const limit = 100;
    const count = 2;
    const cpgId = 0;
    const countryId = 'AR';
    const currentPage = Math.ceil(offset / limit) + 1;
    const products = productsMocks;

    const event = {
      offset,
      limit,
      cpgId,
      countryId,
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: {
        getAll: jest.fn().mockResolvedValue({
          products,
          count,
          currentPage,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        validateProductPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateProductGetAllRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
        }),
        validateExistsResult: jest.fn(),
      },

    };

    const response = {
      httpStatus: 200,
      ok: true,
      code: 200,
      pagination: {
        limit,
        offset,
        count,
        currentPage,
      },
      data: products,
    };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };


    const result = await handlerProducts({ repositories, experts, res }).getProducts(event);

    expect(repositories.mock.calls).toEqual([ [ ] ]);
    expect(experts.product.validateProductGetAllRequiredParams.mock.calls).toEqual([ [ { offset: 1, limit: 100, cpgId: 0, countryId: 'AR' } ] ]);
    expect(experts.product.validateProductPaginationParams.mock.calls).toEqual([ [ 1, 100 ] ]);

    const { Product, closeConnection } = await repositories();
    expect(Product.getAll.mock.calls).toEqual([
      [
        1,
        100,
        0,
        'AR',
      ],
    ]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([
      [
        {
          products,
          count: 2,
          currentPage: 2,
        },
      ],
    ]);
    expect(res.success.mock.calls).toEqual([
      [
        products,
        200,
        {
          limit: 100,
          offset: 1,
          count: 2,
          currentPage: 2,
        },
      ],
    ]);
    expect(result).toEqual(response);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {

    const offset = 1;
    const limit = 100;
    const count = 2;
    const cpgId = 0;
    const countryId = 'AR';
    const currentPage = Math.ceil(offset / limit) + 1;
    const products = productsMocks;

    const data = {
      products,
      currentPage,
      count,
    };

    const event = {
      offset,
      limit,
      cpgId,
      countryId,
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: { getAll: jest.fn().mockResolvedValue(data) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        validateProductPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateProductGetAllRequiredParams: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'Validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
        validateExistsResult: jest.fn(),
      },

    };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
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

    const result = await handlerProducts({ repositories, experts, res }).getProducts(event);

    expect(repositories.mock.calls).toEqual([ [ ] ]);
    expect(experts.product.validateProductGetAllRequiredParams.mock.calls).toEqual([ [ { offset: 1, limit: 100, cpgId: 0, countryId: 'AR' } ] ]);
    expect(experts.product.validateProductPaginationParams.mock.calls).toEqual([]);

    const { Product, closeConnection } = await repositories();
    expect(Product.getAll.mock.calls).toEqual([]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 400,
      ok: false,
      code: 100,
      errorType: 'Validation_error',
      message: 'Validation_server_error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const offset = 1;
    const limit = 100;
    const count = 2;
    const cpgId = 0;
    const countryId = 'AR';
    const currentPage = Math.ceil(offset / limit) + 1;
    const products = productsMocks;

    const data = {
      products,
      currentPage,
      count,
    };

    const event = {
      offset,
      limit,
      cpgId,
      countryId,
    };

    const repositories = jest.fn().mockResolvedValue({
      Product: { getAll: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      product: {
        validateProductPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateProductGetAllRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
        }),
        validateExistsResult: jest.fn(),
      },

    };

    const response = {
      httpStatus: 200,
      ok: true,
      code: 200,
      pagination: {
        limit,
        offset,
        count,
        currentPage,
      },
      data: products,
    };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 500,
        ok: false,
        code: 0,
        errorType: 'Server_Error',
        message: 'internal_server_error',
      }),
    };


    const result = await handlerProducts({ repositories, experts, res }).getProducts(event);

    expect(repositories.mock.calls).toEqual([ [ ] ]);
    expect(experts.product.validateProductGetAllRequiredParams.mock.calls).toEqual([ [ { offset: 1, limit: 100, cpgId: 0, countryId: 'AR' } ] ]);
    expect(experts.product.validateProductPaginationParams.mock.calls).toEqual([ [ 1, 100 ] ]);

    const { Product, closeConnection } = await repositories();
    expect(Product.getAll.mock.calls).toEqual([
      [
        1,
        100,
        0,
        'AR',
      ],
    ]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([]);
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
      httpStatus: 500,
      ok: false,
      code: 0,
      errorType: 'Server_Error',
      message: 'internal_server_error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});