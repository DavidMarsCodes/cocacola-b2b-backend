const handlerClient = require('../lambda');
const { clientsMock, resMock } = require('./__mocks__/client');

describe('GetClients Lamda Function', () => {
  it('Request the data of all clients.', async () => {

    // Create mockups.
    const clients = clientsMock;

    const event = {
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
    };

    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getAll: jest.fn().mockResolvedValue({
          clients,
          count: 3,
          currentPage: 1,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateClientGetAllRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
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
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const result = await handlerClient({ repositories, experts, res }).getClients(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.client.validateClientGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: 1,
          countryId: 'AR',
          limit: 3,
          offset: 0,
        },
      ],
    ]);
    expect(experts.client.validateClientPaginationParams.mock.calls).toEqual([ [ 0, 3 ] ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        {
          clients,
          count: 3,
          currentPage: 1,
        },
      ],
    ]);

    expect(res.success.mock.calls).toEqual([ [
      clients,
      200,
      {
        limit: 3,
        offset: 0,
        count: 3,
        currentPage: 1,
      },
    ] ]);

    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      pagination: { limit: 3, offset: 0, count: 3, currentPage: 1 },
      data: [
        {
          id: 'f43gg54fdgfdgfh56hfdafsdfukjhjjldf5uyiuyiyu63h65uh655j65j6',
          cpgId: '12345556',
          organizationId: '481913258fgffg285329',
          countryId: '2188',
          clientId: 'f43fg54ygsfdgs54y6h6j76j76j',
          fiscalId: 'j67j76j57gsgfsj57j875j8k8jk57',
          fiscalName: 'Hineken SA',
          fantasyName: 'Heineken',
          parentClientId: '453453trttertert5j77k8k6gf34t454565465464',
          deleted: false,
          salesOrganization: 'ninguno',
          distributionChanel: 'masivo',
          createdAt: '2020-10-12T16:25:19.000Z',
          updatedAt: '2020-10-13T00:25:38.000Z',
        },
        {
          id: 'f43gg5g54g54fdgfdgfh56h563h65uh655j65j6',
          cpgId: '12345556',
          organizationId: '481913258fgffg285329',
          countryId: '2188',
          clientId: 'f43fg54ygsfdgs54y6h6j76j76j',
          fiscalId: 'j67j76j57gsgfsj57j875j8k8jk57',
          fiscalName: 'Coca-Cola SA',
          fantasyName: 'Coca-Cola',
          parentClientId: '453453trttertert5j77k8k6gf34t454565465464',
          deleted: false,
          salesOrganization: 'ninguno',
          distributionChanel: 'masivo',
          createdAt: '2020-10-12T16:25:19.000Z',
          updatedAt: '2020-10-12T16:25:19.000Z',
        },
        {
          id: 'f43gg5g54g54fdgfdgfh56hfdafsdfdf5uyiuyiyu63h65uh655j65j6',
          cpgId: '12345556',
          organizationId: '481913258fgffg285329',
          countryId: '2188',
          clientId: 'f43fg54ygsfdgs54y6h6j76j76j',
          fiscalId: 'j67j76j57gsgfsj57j875j8k8jk57',
          fiscalName: 'Quilmes SA',
          fantasyName: 'Quilmes',
          parentClientId: '453453trttertert5j77k8k6gf34t454565465464',
          deleted: false,
          salesOrganization: 'ninguno',
          distributionChanel: 'masivo',
          createdAt: '2020-10-12T16:25:19.000Z',
          updatedAt: '2020-10-12T23:24:48.000Z',
        },
      ],
    });

    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {

    const event = {
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
    };

    const repositories = jest.fn().mockResolvedValue({
      Client: {
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
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateClientGetAllRequiredParams: jest.fn(() => {
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
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'InternalServerError', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerClient({ repositories, experts, res }).getClients(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.client.validateClientGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: 1,
          countryId: 'AR',
          limit: 3,
          offset: 0,
        },
      ],
    ]);
    expect(experts.client.validateClientPaginationParams.mock.calls).toEqual([]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
        100,
        'Validation_Error',
        400,
      ],
    ]);

    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a default error of type Server_Error as it is not a handled error.', async () => {

    const event = {
      cpgId: 1,
      countryId: 'AR',
      offset: 0,
      limit: 3,
    };

    const repositories = jest.fn().mockResolvedValue({
      Client: { getAll: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientPaginationParams: jest.fn().mockReturnValue({
          offset: event.offset,
          limit: event.limit,
        }),
        validateClientGetAllRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
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
      error: jest.fn((message = '', code = 0, errorType = 'InternalServerError', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerClient({ repositories, experts, res }).getClients(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.client.validateClientGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: 1,
          countryId: 'AR',
          limit: 3,
          offset: 0,
        },
      ],
    ]);
    expect(experts.client.validateClientPaginationParams.mock.calls).toEqual([ [ 0, 3 ] ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([ [
      'internal_server_error',
      0,
      'Server_Error',
      500,
    ] ]);

    expect(result).toEqual({
      httpStatus: 500,
      ok: false,
      code: 0,
      errorType: 'Server_Error',
      message: 'internal_server_error',
    });

    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});