const handler = require('../lambda');

describe('Function Lambda', () => {

  it('It should return a status 200 with the data of the tags.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 2,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getTags: jest.fn().mockResolvedValue({
          sectors: [
            { name: 'Gaseosas', productGroupId: 1 },
            { name: 'Isotonicas', productGroupId: 4 },
            { name: 'Aguas Saborizadas', productGroupId: 6 },
          ],
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { portfolio: { validatePortfolioGetLabelRequiredParams: jest.fn() } };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn() }) };

    const { getLabel } = handler({ accessControl, repositories, experts, res });
    await getLabel(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getTags.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 2,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([ [ 200 ] ]);
    expect(res.status().json.mock.calls).toEqual([
      [
        {
          sectors: [
            { name: 'Gaseosas', productGroupId: 1 },
            { name: 'Isotonicas', productGroupId: 4 },
            { name: 'Aguas Saborizadas', productGroupId: 6 },
          ],
        },
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a validation error.', async () => {

    const data = {
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 2,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };


    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getTags: jest.fn().mockResolvedValue({
          sectors: [
            { name: 'Gaseosas', productGroupId: 1 },
            { name: 'Isotonicas', productGroupId: 4 },
            { name: 'Aguas Saborizadas', productGroupId: 6 },
          ],
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      portfolio: {
        validatePortfolioGetLabelRequiredParams: jest.fn(() => {
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
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn(),
    };

    const { getLabel } = handler({ accessControl, repositories, experts, res });
    await getLabel(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getTags.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

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

  it('It should return an unhandled error.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 2,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: { getTags: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { portfolio: { validatePortfolioGetLabelRequiredParams: jest.fn() } };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn(),
    };

    const { getLabel } = handler({ accessControl, repositories, experts, res });
    await getLabel(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getTags.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 2,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        500,
        'Server_Error',
        500,
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});