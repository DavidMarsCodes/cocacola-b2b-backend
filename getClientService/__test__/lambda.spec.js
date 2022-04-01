const handlerClient = require('../lambda');
const { clientMock, resMock } = require('./__mocks__/client');

describe('GetClient Lamda Function', () => {
  it('Request for customer data.', async () => {

    // Create mockups.
    const client = clientMock;

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '123kdkdkkd12k3k3k',
      clientId: 1,
      erpClientId: 'ERP_CLIENT3',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const byErpId = true;

    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getById: jest.fn().mockResolvedValue({ client }),
        getByErpId: jest.fn().mockResolvedValue({ client }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientByIdParams: jest.fn().mockReturnValue({ byErpId }),
        validateClientGetByIdRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
          organizationId: event.organizationId,
          transactionId: event.transactionId,
        }),
        validateExistsResult: jest.fn(),
      },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const res = {
      success: jest.fn((client = clientMock, status = 200) => ({ resMock })).mockReturnValue({ resMock }),
      error: jest.fn(),
    };

    const result = await handlerClient({ accessControl, repositories, experts, res }).getClient(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.client.validateClientGetByIdRequiredParams.mock.calls).toEqual([
      [ {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        transactionId: '123kdkdkkd12k3k3k',
        clientId: 1,
        erpClientId: 'ERP_CLIENT3',
        b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
      } ],
    ]);
    expect(experts.client.validateClientByIdParams.mock.calls).toEqual([
      [ 1, 'ERP_CLIENT3' ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [ { client } ],
    ]);

    expect(result).toEqual({ resMock });
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a handled error in case of failure to validate the required parameters.', async() => {

    // Create mockups.
    const client = clientMock;
    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '123kdkdkkd12k3k3k',
      clientId: 1000,
      erpClientId: 'CLIENT3',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const byErpId = true;

    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getById: jest.fn().mockResolvedValue({ client }),
        getByErpId: jest.fn().mockResolvedValue({ client }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientByIdParams: jest.fn().mockReturnValue({ byErpId }),
        validateClientGetByIdRequiredParams: jest.fn().mockRejectedValue(),
        validateExistsResult: jest.fn(),
      },

    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data,
      })),
      error: jest.fn((message = 'validation_server_error', code = 100, errorType = 'Validation_Error', status = 400) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerClient({ accessControl, repositories, experts, res }).getClient(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.client.validateClientGetByIdRequiredParams.mock.calls).toEqual([
      [ {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        transactionId: '123kdkdkkd12k3k3k',
        clientId: 1000,
        erpClientId: 'CLIENT3',
        b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
      } ],
    ]);
    expect(experts.client.validateClientByIdParams.mock.calls).toEqual([
      [ 1000, 'CLIENT3' ],
    ]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a default error of type Server_Error as it is not a handled error.', async() => {

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      transactionId: '123kdkdkkd12k3k3k',
      clientId: 1000,
      erpClientId: 'CLIENT3',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };
    const byErpId = true;
    const repositories = jest.fn().mockResolvedValue({
      Client: {
        getById: jest.fn().mockRejectedValue({}),
        getByErpId: jest.fn().mockRejectedValue({}),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      client: {
        validateClientByIdParams: jest.fn().mockReturnValue({ byErpId }),
        validateClientGetByIdRequiredParams: jest.fn().mockReturnValue({
          cpgId: event.cpgId,
          countryId: event.countryId,
          organizationId: event.organizationId,
          transactionId: event.transactionId,
        }),
        validateExistsResult: jest.fn(),
      },

    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const result = await handlerClient({ accessControl, repositories, experts, res }).getClient(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.client.validateClientGetByIdRequiredParams.mock.calls).toEqual([
      [ {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        transactionId: '123kdkdkkd12k3k3k',
        clientId: 1000,
        erpClientId: 'CLIENT3',
        b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
      } ],
    ]);
    expect(experts.client.validateClientByIdParams.mock.calls).toEqual([
      [ 1000, 'CLIENT3' ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);

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
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});