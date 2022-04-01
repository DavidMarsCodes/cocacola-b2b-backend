const handler = require('../lambda');

describe('GetFilter Function', () => {

  it('It should return a user is filters.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };


    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getFilters: jest.fn().mockResolvedValue({
          brand: [ 'Coca Cola' ],
          size: [ '1.0 Litro' ],
          package: [ 'PET' ],
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { portfolio: { validationRequiredParamsGetFilter: jest.fn().mockReturnValue() } };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue() }) };

    const { getFilter } = handler({ accessControl, repositories, experts, res });
    await getFilter(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getFilters.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([ [ 200 ] ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          brand: [ 'Coca Cola' ],
          size: [ '1.0 Litro' ],
          package: [ 'PET' ],
        },
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should roll back a validation error.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: {
        getFilters: jest.fn().mockResolvedValue({
          brand: [ 'Coca Cola' ],
          size: [ '1.0 Litro' ],
          package: [ 'PET' ],
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      portfolio: {
        validationRequiredParamsGetFilter: jest.fn(() => {
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

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue() }),
      error: jest.fn().mockReturnValue({}),
    };

    const { getFilter } = handler({ accessControl, repositories, experts, res });
    await getFilter(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getFilters.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
        100,
        'Validation_error',
        400,
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should roll back an error by default.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      organizationId: '3043',
      clientId: 3,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Portfolio: { getFilters: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { portfolio: { validationRequiredParamsGetFilter: jest.fn() } };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue() }),
      error: jest.fn().mockReturnValue({}),
    };

    const { getFilter } = handler({ accessControl, repositories, experts, res });
    await getFilter(data);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.portfolio.validationRequiredParamsGetFilter.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Portfolio, closeConnection } = await repositories();
    expect(Portfolio.getFilters.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          clientId: 3,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);
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