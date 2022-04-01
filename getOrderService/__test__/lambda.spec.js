const handler = require('../lambda');

describe('GetOrder Lambda Function', () => {
  it('It should return an array with the orders.', async () => {

    const data = [
      {
        orderId: 49,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
      {
        orderId: 50,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
    ];

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      clientId: 2,
      offset: 0,
      limit: 100,
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
      Order: {
        get: jest.fn().mockResolvedValue({
          currentPage: 1,
          count: 10,
          data,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        validateGetOrder: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
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
        code: 100,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { getOrder } = handler({ accessControl, repositories, experts, res });

    const result = await getOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.validateGetOrder.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          clientId: 2,
          offset: 0,
          limit: 100,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(experts.order.validPaginationParams.mock.calls).toEqual([
      [
        0,
        100,
        0,
        7,
      ],
    ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
        },
        0,
        100,
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [

        [
          {
            orderId: 49,
            clientId: 2,
            cpgId: '001',
            countryId: 'AR',
            organizationId: '3043',
            erpOrderId: null,
            orderDeliveyDate: '2020-12-27T00:00:00.000Z',
            status: 'test front',
            createdBy: null,
            createdTime: null,
            updatedBy: null,
            updatedTime: null,
          },
          {
            orderId: 50,
            clientId: 2,
            cpgId: '001',
            countryId: 'AR',
            organizationId: '3043',
            erpOrderId: null,
            orderDeliveyDate: '2020-12-27T00:00:00.000Z',
            status: 'test front',
            createdTime: null,
            updatedBy: null,
            updatedTime: null,
          },
        ],

      ],
    ]);

    expect(res.success.mock.calls).toEqual([
      [
        data,
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
        limit: 100,
        count: 10,
        currentpage: 1,
      },
      data: [
        {
          orderId: 49,
          clientId: 2,
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpOrderId: null,
          orderDeliveyDate: '2020-12-27T00:00:00.000Z',
          status: 'test front',
          createdBy: null,
          createdTime: null,
          updatedBy: null,
          updatedTime: null,
        },
        {
          orderId: 50,
          clientId: 2,
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpOrderId: null,
          orderDeliveyDate: '2020-12-27T00:00:00.000Z',
          status: 'test front',
          createdTime: null,
          updatedBy: null,
          updatedTime: null,
        },
      ],
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return an error of type Validation_error in case of receiving an invalid parameter.', async () => {

    const data = [
      {
        orderId: 49,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
      {
        orderId: 50,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
    ];

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      clientId: 2,
      offset: 0,
      limit: 100,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        get: jest.fn().mockResolvedValue({
          currentPage: 1,
          count: 10,
          data,
        }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        validateGetOrder: jest.fn(() => {
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
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { getOrder } = handler({ accessControl, repositories, experts, res });

    const result = await getOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.validateGetOrder.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          clientId: 2,
          offset: 0,
          limit: 100,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.order.validPaginationParams.mock.calls).toEqual([]);

    const { Order, closeConnection } = await repositories();
    expect(Order.get.mock.calls).toEqual([]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([]);

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

    const data = [
      {
        orderId: 49,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
      {
        orderId: 50,
        clientId: 2,
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpOrderId: null,
        orderDeliveyDate: '2020-12-27T00:00:00.000Z',
        status: 'test front',
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
      },
    ];

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      clientId: 2,
      offset: 0,
      limit: 100,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const repositories = jest.fn().mockResolvedValue({
      Order: { get: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        validateGetOrder: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
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

    const { getOrder } = handler({ accessControl, repositories, experts, res });

    const result = await getOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([]);

    expect(experts.order.validPaginationParams.mock.calls).toEqual([
      [
        0,
        100,
        0,
        7,
      ],
    ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.get.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
        },
        0,
        100,
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([]);

    expect(res.success.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
        500,
        'sequelize_error',
        400,
        {
          name: 'SequelizeForeignKeyConstraintError',
          description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
          fields: [ 'productId' ],
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

});