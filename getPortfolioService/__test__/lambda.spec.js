const handlerPortfolio = require('../lambda');
const { portfoliosMock, portfolioMock } = require('./__mock__/portfolio');

describe('GetPortfolio Lamda Function', () => {
  it('Request the data of getAll portfolio.', async() => {

    // Create mockups.
    const portfolio = portfoliosMock;

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      offset: 0,
      limit: 3,
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: '001AR3043-ERP-CLIENT2',
      deliverydate: '2020-11-19T12:00:00Z',
    };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getAll: jest.fn().mockResolvedValue({
          portfolio,
          count: 3,
          currentPage: 1,
        }),
      },
    });

    const experts = {
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(), // .mockReturnValue({
        // cpgId: event.cpgId,
        // countryId: event.countryId,
        // }),

        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
      },

    };

    const res = {
      success: jest.fn((portfolio, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
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

    const result = await handlerPortfolio({ repositories, experts, res }).getPortfolio(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
      [ {
        transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        offset: 0,
        limit: 3,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: '001AR3043-ERP-CLIENT2',
        deliverydate: '2020-11-19T12:00:00Z',
      } ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [ 0, 3 ],
    ]);
    expect(experts.portfolio.validateExistsResult.mock.calls).toEqual([
      [ portfolio ],
    ]);

    expect(res.success.mock.calls).toEqual([
      [
        portfolio,
        200,
        {
          limit: 3,
          offset: 0,
          count: 3,
          currentPage: 1,
        },
      ],
    ]);

    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      pagination: { limit: 3, offset: 0, count: 3, currentPage: 1 },
      data: [ {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        productId: '001AR3043-CC-R-2.5-PET',
        name: 'Coca Cola retornable 2.5l',
        productErpId: 'CC-R-2.5-PET',
        locked: false,
        availability: true,
        brand: 'Coca Cola',
        size: '2.5 Litros',
        package: 'PET',
        returnability: true,
        image: null,
        deleted: false,
        createdBy: 'andres.reynoso',
        createdTime: '2020-11-04 18:27:57.0',
        updatedBy: null,
        updatedTime: null,
        price: {
          validity_from: '2020-11-01T00:00:00.000Z',
          validity_to: '2020-11-30T00:00:00.000Z',
          listPrice: '120',
          finalPrice: '123',
          taxes: '3',
          discounts: '0',
          others: '0',
        },
      },
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        productId: '001AR3043-CC-NR-3.0-PET',
        name: 'Coca Cola NO retornable 2.0l',
        productErpId: 'CC-NR-3.0-PET',
        locked: false,
        availability: true,
        brand: 'Coca Cola',
        size: '3.0 Litros',
        package: 'PET',
        returnability: true,
        image: null,
        deleted: false,
        createdBy: 'andres.reynoso',
        createdTime: '2020-11-04 18:27:57.0',
        updatedBy: null,
        updatedTime: null,
        price: {
          validity_from: '2020-11-01T00:00:00.000Z',
          validity_to: '2020-11-30T00:00:00.000Z',
          listPrice: '220',
          finalPrice: '223',
          taxes: '6',
          discounts: '0',
          others: '0',
        },
      },
      ],
    });

  });

  it('It should return a handled error in case of failure to validate the required parameters.', async() => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      offset: 0,
      limit: 3,
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: '001AR3043-ERP-CLIENT2',
      deliverydate: '2020-11-19T12:00:00Z',
    };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getAll: jest.fn().mockRejectedValue({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: 500,
            status: 'error',
            code: 100,
            msg: 'internal_server_error',
            type: 'server_error',
          }),
        }),
      },
    });

    const experts = {
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'validation_server_error',
              type: 'Validation_Error',
            }),
          };
        }),
        validateExistsResult: jest.fn(),
      },
    };

    const res = {
      success: jest.fn((portfolio, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data: portfolio,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'InternalServerError', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerPortfolio({ repositories, experts, res }).getPortfolio(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
      [ {
        transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        offset: 0,
        limit: 3,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: '001AR3043-ERP-CLIENT2',
        deliverydate: '2020-11-19T12:00:00Z',
      } ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [ event.offset, event.limit ],
    ]);
    expect(experts.portfolio.validateExistsResult.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
        100,
        'Validation_Error',
        400,
      ],
    ]);

  });

  it('It should return a default error of type Server_Error as it is not a handled error.', async() => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      offset: 0,
      limit: 3,
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: '001AR3043-ERP-CLIENT2',
      deliverydate: '2020-11-19T12:00:00Z',
    };

    const repositories = jest.fn().mockResolvedValue({ Portfolio: { getAll: jest.fn().mockRejectedValue({}) } });

    const experts = {
      portfolio: {
        validatePortfolioPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validatePortfolioGetAllRequiredParams: jest.fn(), // .mockReturnValue({
        //     cpgId: event.cpgId,
        //     countryId: event.countryId,
        //     clientId: event.clientId
        // }),

        validateExistsResult: jest.fn(),
        isValidDate: jest.fn(),
      },
    };

    const res = {
      success: jest.fn((portfolio, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data: portfolio,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'InternalServerError', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerPortfolio({ repositories, experts, res }).getPortfolio(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.portfolio.validatePortfolioGetAllRequiredParams.mock.calls).toEqual([
      [ {
        transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        offset: 0,
        limit: 3,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: '001AR3043-ERP-CLIENT2',
        deliverydate: '2020-11-19T12:00:00Z',
      } ],
    ]);
    expect(experts.portfolio.validatePortfolioPaginationParams.mock.calls).toEqual([
      [ 0, 3 ],
    ]);
    expect(experts.portfolio.validateExistsResult.mock.calls).toEqual([]);

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

  });

});