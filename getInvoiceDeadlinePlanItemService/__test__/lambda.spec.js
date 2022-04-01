const handlerInvoiceDeadlinePlanItem = require('../lambda');

describe('getInvoiceDeadlinePlanItem Lamda Function', () => {
  it('Request for Invoice Deadline Plan.', async() => {

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      deliveryDate: '2021-01-07',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const data = {
      deadlineTime: '16:30:00',
      timezone: '-3',
    };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(data) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      invoiceDeadlinePlanItem: {
        validateInvoiceDeadlinePlanItemGetAllRequiredParams: jest.fn().mockReturnValue(event),
        validateExistsResult: jest.fn().mockReturnValue(true),
        createValidDeliveryDate: jest.fn().mockReturnValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
        }),
        validateCriticalDate: jest.fn().mockReturnValue(true),
        getCurrentDate: jest.fn().mockReturnValue('2021-04-08'),
        validateExistsPricesDate: jest.fn().mockReturnValue(true),
        validateIfCurrentDateIsAfterDeadline: jest.fn().mockReturnValue(false),
        getOneDayLater: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      client: { validateExistsResult: jest.fn() },
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn().mockReturnValue('2021-04-27T18:51:27.926-03:00'),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(false),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn(),
        buildCurrentDate: jest.fn().mockReturnValue('2021-04-27T18:51:27.926-03:00'),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const luxon = { DateTime: { fromISO: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03'), minus: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03') }) }) } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const result = await handlerInvoiceDeadlinePlanItem({ accessControl, dbRedis, repositories, experts, res, luxon }).getInvoiceDeadlinePlanItem(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
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
    expect(experts.invoiceDeadlinePlanItem.validateInvoiceDeadlinePlanItemGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([ [] ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsPricesDate.mock.calls).toEqual([
      [
        {
          deliverydate: {
            visitDate: '2021-05-20T00:00:00.000Z',
            visitPlanId: 90023,
          },
          pricesDate: '2021-04-27T18:51:27.926-03:00',
        },
      ],
    ]);
    expect(luxon.DateTime.fromISO.mock.calls).toEqual([
      [
        '2021-04-27T18:51:27.926-03:00',
      ],
    ]);
    expect(luxon.DateTime.fromISO().toISODate.mock.calls).toEqual([ [ ] ]);
    const { InvoiceDeadlinePlanItem, Client, closeConnection } = await repositories();
    expect(Client.getDeliveryConditionAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        2,
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        {
          deliveryCondition: 0,
          invoiceDeadlinePlanId: 6,
        },
      ],
    ]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        clientData.invoiceDeadlinePlanId,
        '2021-08-03',
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.visitPlan.buildDeadlineDate.mock.calls).toEqual([
      [
        {
          deadlineTime: '16:30:00',
          timezone: '-3',
        },
      ],
    ]);
    expect(experts.visitPlan.buildCurrentDate.mock.calls).toEqual([
      [
        '-3',
      ],
    ]);
    expect(experts.visitPlan.compareCurrentDateWithDeadlineDate.mock.calls).toEqual([
      [
        '2021-04-27T18:51:27.926-03:00',
        '2021-04-27T18:51:27.926-03:00',
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([
      [
        data,
      ],
    ]);
    expect(res.success.mock.calls).toEqual([
      [
        data,
        200,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      data,
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a empty object because validateCriticalDate is false', async() => {
    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      deliveryDate: '2021-01-07',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const data = { deadlineTime: '16:30:00' };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(data) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      invoiceDeadlinePlanItem: {
        validateInvoiceDeadlinePlanItemGetAllRequiredParams: jest.fn().mockReturnValue(event),
        validateExistsResult: jest.fn().mockReturnValue(true),
        createValidDeliveryDate: jest.fn().mockReturnValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
        }),
        validateCriticalDate: jest.fn().mockReturnValue(false),
        getCurrentDate: jest.fn().mockReturnValue('2021-04-08'),
        validateExistsPricesDate: jest.fn().mockReturnValue(true),
        validateIfCurrentDateIsAfterDeadline: jest.fn().mockReturnValue(false),
        getOneDayLater: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      client: { validateExistsResult: jest.fn() },
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn(),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(false),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn(),
        buildCurrentDate: jest.fn().mockReturnValue('2021-04-27T18:51:27.926-03:00'),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const luxon = { DateTime: { fromISO: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03'), minus: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03') }) }) } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const result = await handlerInvoiceDeadlinePlanItem({ accessControl, dbRedis, repositories, experts, res, luxon }).getInvoiceDeadlinePlanItem(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
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
    expect(experts.invoiceDeadlinePlanItem.validateInvoiceDeadlinePlanItemGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([ [] ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsPricesDate.mock.calls).toEqual([
      [
        {
          deliverydate: {
            visitDate: '2021-05-20T00:00:00.000Z',
            visitPlanId: 90023,
          },
          pricesDate: '2021-04-27T18:51:27.926-03:00',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsPricesDate.mock.calls).toEqual([
      [
        {
          deliverydate: {
            visitDate: '2021-05-20T00:00:00.000Z',
            visitPlanId: 90023,
          },
          pricesDate: '2021-04-27T18:51:27.926-03:00',
        },
      ],
    ]);
    expect(luxon.DateTime.fromISO.mock.calls).toEqual([
      [
        '2021-04-27T18:51:27.926-03:00',
      ],
    ]);
    expect(luxon.DateTime.fromISO().toISODate.mock.calls).toEqual([ [ ] ]);
    const { InvoiceDeadlinePlanItem, Client, closeConnection } = await repositories();
    expect(Client.getDeliveryConditionAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        2,
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        {
          deliveryCondition: 0,
          invoiceDeadlinePlanId: 6,
        },
      ],
    ]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        6,
        '2021-08-03',
        {
          countryId: 'CL',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([
      [
        { deadlineTime: '16:30:00' },
      ],
    ]);
    expect(res.success.mock.calls).toEqual([
      [
        { deadlineTime: '16:30:00' },
        200,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      data: { deadlineTime: '16:30:00' },
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async() => {

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      deliveryDate: '2021-01-07',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const data = { deadlineTime: '16:30:00' };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(data) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      invoiceDeadlinePlanItem: {
        validateInvoiceDeadlinePlanItemGetAllRequiredParams: jest.fn(() => {
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
        validateExistsResult: jest.fn().mockReturnValue(true),
        validateCriticalDate: jest.fn().mockReturnValue(true),
        getCurrentDate: jest.fn().mockReturnValue('2021-04-08'),
        validateExistsPricesDate: jest.fn().mockReturnValue(true),
        validateIfCurrentDateIsAfterDeadline: jest.fn().mockReturnValue(false),
        getOneDayLater: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      client: { validateExistsResult: jest.fn() },
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn(),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(false),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn(),
        buildCurrentDate: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const luxon = { DateTime: { fromISO: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03'), minus: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03') }) }) } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const result = await handlerInvoiceDeadlinePlanItem({ accessControl, dbRedis, repositories, experts, res, luxon }).getInvoiceDeadlinePlanItem(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
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
    expect(experts.invoiceDeadlinePlanItem.validateInvoiceDeadlinePlanItemGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsPricesDate.mock.calls).toEqual([]);
    const { InvoiceDeadlinePlanItem, Client, closeConnection } = await repositories();
    expect(Client.getDeliveryConditionAndInvoiceDeadlinePlanId.mock.calls).toEqual([]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([]);
    expect(experts.invoiceDeadlinePlanItem.validateCriticalDate.mock.calls).toEqual([]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(result).toEqual({
      httpStatus: 404,
      ok: true,
      code: 1001,
      errorType: 'Not Found',
      message: 'descripcion del error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a default error of type Server_Error as it is not a handled error.', async() => {

    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 2,
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
      deliveryDate: '2021-01-07',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const data = { deadlineTime: '16:30:00' };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockRejectedValue({}) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      invoiceDeadlinePlanItem: {
        validateInvoiceDeadlinePlanItemGetAllRequiredParams: jest.fn().mockReturnValue(event),
        validateExistsResult: jest.fn().mockReturnValue(true),
        createValidDeliveryDate: jest.fn().mockReturnValue({
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
        }),
        validateCriticalDate: jest.fn().mockReturnValue(true),
        getCurrentDate: jest.fn().mockReturnValue('2021-04-08'),
        validateExistsPricesDate: jest.fn().mockReturnValue(true),
        validateIfCurrentDateIsAfterDeadline: jest.fn().mockReturnValue(false),
        getOneDayLater: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      client: { validateExistsResult: jest.fn() },
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn(),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(false),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn(),
        buildCurrentDate: jest.fn().mockReturnValue('2021-06-26T00:00:00.092Z'),
      },
      order: { hasOperationDates: jest.fn() },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
                        { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const luxon = { DateTime: { fromISO: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03'), minus: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-08-03') }) }) } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
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

    const result = await handlerInvoiceDeadlinePlanItem({ accessControl, dbRedis, repositories, experts, res, luxon }).getInvoiceDeadlinePlanItem(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
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
    expect(experts.invoiceDeadlinePlanItem.validateInvoiceDeadlinePlanItemGetAllRequiredParams.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 2,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
          deliveryDate: '2021-01-07',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    const { InvoiceDeadlinePlanItem, closeConnection } = await repositories();
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        clientData.invoiceDeadlinePlanId,
        '2021-08-03',
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(result).toEqual({
      httpStatus: 404,
      ok: true,
      code: 1001,
      errorType: 'Not Found',
      message: 'descripcion del error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});