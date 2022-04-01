const handler = require('../lambda');
const luxon = require('luxon');
const lodash = require('lodash');

describe('Lambda Function', () => {
  it('You should set the pricesDate and deliverydate values in redis', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      visitType: 'delivery',
      deliverydate: '2021-06-08T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { getByDate: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devParameters' });

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
      },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const experts = {
      visitPlan: {
        validateIsBefore: jest.fn().mockReturnValue({}),
        validateExistsDate: jest.fn().mockReturnValue({}),
        validateSetOperationDates: jest.fn().mockReturnValue({}),
      },
      portfolio: { priceDateByCountry: jest.fn().mockReturnValue({}) },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      closeConnection: jest.fn()
    });

    const strategies = {
      deliveryManagerStrategy: jest.fn().mockReturnValue({
        deliveryManager: jest.fn().mockResolvedValue({
          pricesDate: '2021-10-18T15:32:53.197-03:00',
          deliverydate: {
            visitDate: '2021-10-19T00:00:00.000Z',
            visitPlanId: 8283,
            visitType: 'delivery',
          },
          deliveryfrozen: {
            visitDate: '2021-10-23T00:00:00.000Z',
            visitPlanId: 12355,
            visitType: 'deliveryfrozen',
          },
        }),
      }),
    };
    const res = {
      success: jest.fn((data, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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


    const { setOperationDates } = handler({ accessControl, repositories, res, dbRedis, experts, awsRepositories, getTableName, lodash, luxon, strategies });

    await setOperationDates(event);

    expect(dbRedis.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validateSetOperationDates.calls);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(experts.visitPlan.validateIsBefore.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
      ],
    ]);
    const { VisitPlan, closeConnection } = await repositories();
    expect(VisitPlan.getByDate.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          deliverydate: '2021-06-08T00:00:00.000Z',
          deliveryType: [
            'delivery',
            'deliveryfrozen',
          ],
          visitType: 'delivery',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.visitPlan.validateExistsDate.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devParameters',
        { paramId: '001-CL-3043' },
      ],
    ]);
    // expect(lodash.round.mock.calls).toEqual([
    //     [
    //         7200
    //     ]
    // ]);
    const redis = await dbRedis();
    expect(redis.operationDates.upsert).toHaveBeenCalled();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('This should throw an unhandled error', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      deliverydate: '2021-06-08T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { getByDate: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devParameters' });

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
      },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const experts = {
      visitPlan: {
        validateIsBefore: jest.fn().mockReturnValue({}),
        validateExistsDate: jest.fn().mockReturnValue({}),
        validateSetOperationDates: jest.fn().mockReturnValue({}),
      },
      portfolio: { priceDateByCountry: jest.fn().mockReturnValue({}) },
    };

    const lodash = { round: jest.fn() };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      closeConnection: jest.fn(),
    });

    const res = {
      success: jest.fn((data, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const { setOperationDates } = handler({ accessControl, repositories, res, dbRedis, experts, awsRepositories, getTableName, lodash, luxon });
    await setOperationDates(event);

    expect(dbRedis.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validateSetOperationDates.calls);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(experts.visitPlan.validateIsBefore.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
      ],
    ]);
    const { VisitPlan, closeConnection } = await repositories();
    expect(VisitPlan.getByDate.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          deliverydate: '2021-06-08T00:00:00.000Z',
          deliveryType: [
            'delivery',
            'deliveryfrozen',
          ],
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.visitPlan.validateExistsDate.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(lodash.round.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.upsert.mock.calls).toEqual([]);
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

  it('this should throw a handled error in case no visit plans are found', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      deliverydate: '2021-06-08T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { getByDate: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devParameters' });

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
      },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const experts = {
      visitPlan: {
        validateIsBefore: jest.fn().mockReturnValue({}),
        validateExistsDate: jest.fn(() => {
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
        validateSetOperationDates: jest.fn().mockReturnValue({}),
      },
      portfolio: { priceDateByCountry: jest.fn().mockReturnValue({}) },
    };

    const lodash = { round: jest.fn() };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      closeConnection: jest.fn(),
    });

    const res = {
      success: jest.fn((data, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const { setOperationDates } = handler({ accessControl, repositories, res, dbRedis, experts, awsRepositories, getTableName, lodash, luxon });
    await setOperationDates(event);

    expect(dbRedis.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validateSetOperationDates.calls);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(experts.visitPlan.validateIsBefore.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
      ],
    ]);
    const { VisitPlan, closeConnection } = await repositories();
    expect(VisitPlan.getByDate.mock.calls).toEqual([
      [
        '2021-06-08T00:00:00.000Z',
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          deliverydate: '2021-06-08T00:00:00.000Z',
          deliveryType: [
            'delivery',
            'deliveryfrozen',
          ],
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.visitPlan.validateExistsDate.mock.calls).toEqual([
      [
        {},
      ],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(lodash.round.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.upsert.mock.calls).toEqual([]);
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

  it('this should throw an error handled by parameter validations', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      deliverydate: '2021-06-08T00:00:00.000Z',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { getByDate: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devParameters' });

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
      },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const experts = {
      visitPlan: {
        validateIsBefore: jest.fn().mockReturnValue({}),
        validateExistsDate: jest.fn().mockReturnValue({}),
        validateSetOperationDates: jest.fn(() => {
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
      portfolio: { priceDateByCountry: jest.fn().mockReturnValue({}) },
    };

    const lodash = { round: jest.fn() };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      closeConnection: jest.fn(),
    });

    const res = {
      success: jest.fn((data, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const { setOperationDates } = handler({ accessControl, repositories, res, dbRedis, experts, awsRepositories, getTableName, lodash, luxon });
    await setOperationDates(event);

    expect(dbRedis.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validateSetOperationDates.calls);
    expect(getTableName.mock.calls).toEqual([]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([]);
    expect(accessControl.getSessionData.mock.calls).toEqual([]);
    expect(experts.visitPlan.validateIsBefore.mock.calls).toEqual([]);
    const { VisitPlan, closeConnection } = await repositories();
    expect(VisitPlan.getByDate.mock.calls).toEqual([]);
    expect(experts.visitPlan.validateExistsDate.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(lodash.round.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.upsert.mock.calls).toEqual([]);
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
});