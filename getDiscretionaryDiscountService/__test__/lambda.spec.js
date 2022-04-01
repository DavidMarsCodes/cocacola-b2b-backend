const handler = require('../lambda');
const { data, event, pagination } = require('./__mock__/discretionaryDiscount');

describe('Function Lambda GetDiscretionaryDiscounts', () => {

  it('It should return a status 200 with the discretionary discount\'s list', async () => {
    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };
    const repositories = jest.fn().mockResolvedValue({
      Discount: {
        getDiscretionaryDiscountsByClient: jest.fn().mockResolvedValue({
          data,
          currentPage: 1,
          count: 10,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      discount: {
        validateDiscountGetAllRequiredParams: jest.fn(),
        validateDiscountPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        validateExistsResult: jest.fn(),
        discretionaryDiscountDateFilter: jest.fn(),
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
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 100,
        errorType: 'Not Found',
        message: 'no se encontró el registro',
      }),
    };

    const { getDiscretionaryDiscountService } = handler({ accessControl, repositories, experts, res });
    const result = await getDiscretionaryDiscountService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.discount.validateDiscountGetAllRequiredParams.mock.calls).toEqual([ [ event ] ]);
    expect(experts.discount.validateDiscountPaginationParams.mock.calls).toEqual([ [ 0, 40 ] ]);
    const { Discount, closeConnection } = await repositories();
    expect(Discount.getDiscretionaryDiscountsByClient.mock.calls).toEqual([
      [ {
        clientId: 2,
        countryId: 'CL',
        cpgId: '001',
        filterDate: undefined,
        organizationId: '3043',
      },
      0,
      40 ],
    ]);

    expect(experts.discount.validateExistsResult.mock.calls).toEqual([ [
      {
        count: 10,
        currentPage: 1,
        data,
      },
    ] ]);

    expect(res.success.mock.calls).toEqual([
      [
        undefined,
        200,
        pagination,
      ],
    ]);

    expect(res.error.mock.calls).toEqual([]);

    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      pagination: {
        offset: 0,
        limit: 40,
        count: 10,
        currentPage: 1,
      },
      data: undefined,
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a validation error', async () => {

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Discount: {
        getDiscretionaryDiscountsByClient: jest.fn().mockResolvedValue({
          currentPage: 1,
          count: 10,
          data,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      discount: {
        validateDiscountGetAllRequiredParams: jest.fn(() => {
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
        validateDiscountPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        validateExistsResult: jest.fn(),
      },
    };

    const res = {
      success: jest.fn((resp, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 100,
        errorType: 'Not Found',
        message: 'no se encontró el registro',
      }),
    };

    const { getDiscretionaryDiscountService } = handler({ accessControl, repositories, experts, res });
    await getDiscretionaryDiscountService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Discount, closeConnection } = await repositories();
    expect(Discount.getDiscretionaryDiscountsByClient.mock.calls).toEqual([]);

    expect(res.success.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return an unhandled error', async () => {

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Discount: { getDiscretionaryDiscountsByClient: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      discount: {
        validateDiscountGetAllRequiredParams: jest.fn(),
        validateDiscountPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        validateExistsResult: jest.fn(),
        discretionaryDiscountDateFilter: jest.fn(),
      },
    };

    const res = {
      success: jest.fn().mockReturnValue({}, 200),
      error: jest.fn(),
    };

    const { getDiscretionaryDiscountService } = handler({ accessControl, repositories, experts, res });
    await getDiscretionaryDiscountService(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Discount, closeConnection } = await repositories();
    expect(Discount.getDiscretionaryDiscountsByClient.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          filterDate: undefined,
          clientId: 2,
        },
        0,
        40,
      ],
    ]);

    expect(res.success.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'Server_Error',
        500,
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});