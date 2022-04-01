const handlerClientVisitPlan = require('../lambda');

describe('GetClientVisitPlan Lambda Function', () => {
  it('It should return an array with the client is visit plan.', async () => {

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
    };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const event = {
      offset: 0,
      limit: 100,
      clientId: '001AR3043-ERP-CLIENT2',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      visitType: 'delivery',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };
    const pagination = {
      offset: 0,
      limit: 100,
      count: 10,
      currentpage: 1,
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: {
        get: jest.fn().mockResolvedValue({
          currentPage: 1,
          count: 10,
          data,
        }),
      },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };

    const strategies = {
      visitTypeStrategy: jest.fn().mockReturnValue({
        getVisitPlanByVisitType: jest.fn().mockReturnValue(
          {
            currentPage: 1,
            count: 10,
            data,
          },
        ),
      }),
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
        message: 'descripcion del error',
      }),
    };

    const { getClientVisitPlan } = handlerClientVisitPlan({ accessControl, repositories, experts, strategies, res });

    const result = await getClientVisitPlan(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '001AR3043-ERP-CLIENT2',
      ],
    ]);
    expect(experts.visitPlan.validGetClientVisitPlanRequiredParams.mock.calls).toEqual([
      [
        {
          offset: 0,
          limit: 100,
          clientId: '001AR3043-ERP-CLIENT2',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          visitType: 'delivery',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.visitPlan.validPaginationParams.mock.calls).toEqual([
      [
        0,
        100,
        0,
        7,
      ],
    ]);

    const { closeConnection } = await repositories();
    expect(strategies.visitTypeStrategy.mock.calls).toEqual([
      [
        'delivery',
      ],
    ]);
    expect(strategies.visitTypeStrategy().getVisitPlanByVisitType).toHaveBeenCalled();
    expect(res.success.mock.calls).toEqual([
      [
        data,
        200,
        pagination,
      ],
    ]);

    expect(res.error.mock.calls).toEqual([]);

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return an error of type Validation_error in case of receiving an invalid parameter.', async () => {

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
    };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const event = {
      offset: 0,
      limit: 100,
      clientId: '001AR3043-ERP-CLIENT2',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      visitType: 'delivery',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: {
        get: jest.fn().mockResolvedValue({
          currentPage: 1,
          count: 10,
          data,
        }),
      },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(() => {
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
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };

    const strategies = {
      visitTypeStrategy: jest.fn().mockReturnValue({
        getVisitPlanByVisitType: jest.fn().mockReturnValue(
          {
            currentPage: 1,
            count: 10,
            data,
          },
        ),
      }),
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

    const { getClientVisitPlan } = handlerClientVisitPlan({ accessControl, repositories, experts, strategies, res });

    const result = await getClientVisitPlan(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        '001AR3043-ERP-CLIENT2',
      ],
    ]);
    expect(experts.visitPlan.validGetClientVisitPlanRequiredParams.mock.calls).toEqual([
      [
        {
          offset: 0,
          limit: 100,
          clientId: '001AR3043-ERP-CLIENT2',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          visitType: 'delivery',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.visitPlan.validPaginationParams.mock.calls).toEqual([]);
    expect(experts.visitPlan.createValidDeliveryDate.mock.calls).toEqual([]);

    const { closeConnection } = await repositories();
    expect(strategies.visitTypeStrategy.mock.calls).toEqual([]);
    expect(strategies.visitTypeStrategy().getVisitPlanByVisitType.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
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
      message: 'validation_server_error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return an error by default in case the database query fails.', async () => {

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
    };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const event = {
      offset: 0,
      limit: 100,
      clientId: '001AR3043-ERP-CLIENT2',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      visitType: 'delivery',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { get: jest.fn().mockRejectedValue({}) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(() => ({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: 400,
            status: 'error',
            code: 500,
            msg: 'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
            type: 'sequelize_error',
            meta: {
              name: 'SequelizeForeignKeyConstraintError',
              description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
              fields: [ 'productId' ],
            },
          }),
        })),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };

    const strategies = {
      visitTypeStrategy: jest.fn().mockReturnValue({
        getVisitPlanByVisitType: jest.fn(() => {
          throw {
            customError: false,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 500,
              msg: 'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
              type: 'sequelize_error',
              meta: {
                name: 'SequelizeForeignKeyConstraintError',
                description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
                fields: [ 'productId' ],
              },
            }),
          };
        }),
      }),
    };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        pagination: paginationObjet,
        data,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500, data) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
        data,
      })),
    };

    const { getClientVisitPlan } = handlerClientVisitPlan({ accessControl, repositories, experts, strategies, res });

    const result = await getClientVisitPlan(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validGetClientVisitPlanRequiredParams.mock.calls).toEqual([
      [
        {
          offset: 0,
          limit: 100,
          clientId: '001AR3043-ERP-CLIENT2',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          visitType: 'delivery',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.visitPlan.validPaginationParams.mock.calls).toEqual([
      [
        0,
        100,
        0,
        7,
      ],
    ]);
    const { closeConnection } = await repositories();
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
        500,
        'sequelize_error',
        400,
        {
          description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
          fields: [
            'productId',
          ],
          name: 'SequelizeForeignKeyConstraintError',
        },
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 400,
      ok: false,
      code: 500,
      errorType: 'sequelize_error',
      message: 'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
      data: {
        name: 'SequelizeForeignKeyConstraintError',
        description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
        fields: [ 'productId' ],
      },
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a VisitPlan_error when receiving an empty query result.', async () => {

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
    };

    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const event = {
      offset: 0,
      limit: 100,
      clientId: '001AR3043-ERP-CLIENT2',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      visitType: 'delivery',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      VisitPlan: { get: jest.fn().mockResolvedValue(null) },
      Client: { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) },
      InvoiceDeadlinePlanItem: { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 404,
              status: 'error',
              code: 100,
              msg: 'visitPlan_not_found',
              type: 'VisitPlan_error',
            }),
          };
        }),
        handlersDatabaseError: jest.fn(),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };

    const strategies = {
      visitTypeStrategy: jest.fn().mockReturnValue({
        getVisitPlanByVisitType: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 404,
              status: 'error',
              code: 100,
              msg: 'visitPlan_not_found',
              type: 'VisitPlan_error',
            }),
          };
        }),
      }),
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

    const { getClientVisitPlan } = handlerClientVisitPlan({ accessControl, repositories, experts, strategies, res });

    const result = await getClientVisitPlan(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.visitPlan.validGetClientVisitPlanRequiredParams.mock.calls).toEqual([
      [
        {
          offset: 0,
          limit: 100,
          clientId: '001AR3043-ERP-CLIENT2',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          visitType: 'delivery',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.visitPlan.validPaginationParams.mock.calls).toEqual([
      [
        0,
        100,
        0,
        7,
      ],
    ]);

    const { VisitPlan, Client, InvoiceDeadlinePlanItem, closeConnection } = await repositories();
    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'visitPlan_not_found',
        100,
        'VisitPlan_error',
        404,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 404,
      ok: false,
      code: 100,
      errorType: 'VisitPlan_error',
      message: 'visitPlan_not_found',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});