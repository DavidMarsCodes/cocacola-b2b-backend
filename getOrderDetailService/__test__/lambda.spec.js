const handler = require('../lambda');

describe('Function Lambda', () => {
  it('It should return a status 200 with the order details', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 24,
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Order: { getDetailById: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = { success: jest.fn().mockReturnValue({}, 200) };

    const { getOrderDetailService } = handler({ accessControl, repositories, experts, res });
    await getOrderDetailService(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.getDetailById.mock.calls).toEqual([
      [
        {
          countryId: 'AR',
          cpgId: '001',
          orderId: 24,
          organizationId: '3043',
          clientId: 3,
        },
      ],
    ]);

    expect(res.success.mock.calls).toEqual([ [ {}, 200 ] ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a validation error', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 24,
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Order: { getDetailById: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        validateExistsResult: jest.fn(() => {
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
      },
    };

    const res = {
      success: jest.fn().mockReturnValue({}, 200),
      error: jest.fn(),
    };

    const { getOrderDetailService } = handler({ accessControl, repositories, experts, res });
    await getOrderDetailService(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.getDetailById.mock.calls).toEqual([
      [
        {
          countryId: 'AR',
          cpgId: '001',
          orderId: 24,
          organizationId: '3043',
          clientId: 3,
        },
      ],
    ]);

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

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 24,
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Order: { getDetailById: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = {
      success: jest.fn().mockReturnValue({}, 200),
      error: jest.fn(),
    };

    const { getOrderDetailService } = handler({ accessControl, repositories, experts, res });
    await getOrderDetailService(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.getDetailById.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 24,
          clientId: 3,
        },
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