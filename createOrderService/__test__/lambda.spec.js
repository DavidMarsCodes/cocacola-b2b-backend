const handlerOrder = require('../lambda');
const { order } = require('./__mocks__/Order');

describe('CreateOrder Lambda Funtion', () => {
  it('It should create a new order and return a httpStatus 201.', async () => {

    const event = order;

    const repositories = jest.fn().mockResolvedValue({
      Order: { create: jest.fn().mockResolvedValue({ orderId: 1 }) },
      OrderItem: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn().mockReturnValue(true),
        isValidDate: jest.fn().mockReturnValue(true),
        formatDate: jest.fn().mockReturnValue(true),
        isValidProductGroup: jest.fn().mockResolvedValue(true),
        haveCreditAvailable: jest.fn().mockResolvedValue(true),
        haveExistingLocks: jest.fn().mockResolvedValue(true),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createOrder } = handlerOrder({ repositories, experts, res });
    await createOrder(event);


    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.order.isValidDate.mock.calls).toEqual([
      [
        "2020-10-30T12:34:56'Z'",
      ],
    ]);

    expect(experts.order.formatDate.mock.calls).toEqual([
      [
        "2020-10-30T12:34:56'Z'",
      ],
    ]);

    // expect(experts.order.isValidProductGroup.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveCreditAvailable.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveExistingLocks.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.create.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    const { OrderItem } = await repositories();
    expect(OrderItem.create.mock.calls).toEqual([
      [
        { orderId: 1 },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          itemsCreated: true,
          orderId: 1,
        },
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);


  });

  it('It should return an error of type Validation_error in case the dates sent are incorrect.', async () => {

    const event = order;

    const repositories = jest.fn().mockResolvedValue({
      Order: { create: jest.fn().mockResolvedValue({ orderId: 1 }) },
      OrderItem: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn().mockReturnValue(true),
        isValidDate: jest.fn(() => {
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
        formatDate: jest.fn().mockReturnValue(true),
        isValidProductGroup: jest.fn().mockResolvedValue(true),
        haveCreditAvailable: jest.fn().mockResolvedValue(true),
        haveExistingLocks: jest.fn().mockResolvedValue(true),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createOrder } = handlerOrder({ repositories, experts, res });

    await createOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.order.isValidDate.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(experts.order.formatDate.mock.calls).toEqual([]);

    // expect(experts.order.isValidProductGroup.mock.calls).toEqual([]);
    // expect(experts.order.haveCreditAvailable.mock.calls).toEqual([]);
    // expect(experts.order.haveExistingLocks.mock.calls).toEqual([]);

    const { Order, closeConnection } = await repositories();
    expect(Order.create.mock.calls).toEqual([]);

    const { OrderItem } = await repositories();
    expect(OrderItem.create.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

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

  it('It should return an error of type Validation_error in case the required parameters are incorrect.', async () => {

    const event = order;

    const repositories = jest.fn().mockResolvedValue({
      Order: { create: jest.fn().mockResolvedValue({ orderId: 1 }) },
      OrderItem: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(() => {
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
        isValidDate: jest.fn().mockReturnValue(true),
        formatDate: jest.fn().mockReturnValue(true),
        isValidProductGroup: jest.fn().mockResolvedValue(true),
        haveCreditAvailable: jest.fn().mockResolvedValue(true),
        haveExistingLocks: jest.fn().mockResolvedValue(true),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createOrder } = handlerOrder({ repositories, experts, res });

    await createOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.order.isValidDate.mock.calls).toEqual([]);

    expect(experts.order.formatDate.mock.calls).toEqual([]);

    // expect(experts.order.isValidProductGroup.mock.calls).toEqual([]);
    // expect(experts.order.haveCreditAvailable.mock.calls).toEqual([]);
    // expect(experts.order.haveExistingLocks.mock.calls).toEqual([]);

    const { Order, closeConnection } = await repositories();
    expect(Order.create.mock.calls).toEqual([]);

    const { OrderItem } = await repositories();
    expect(OrderItem.create.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

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

  it('It should return an unhandled error in case an Order cannot be saved.', async () => {

    const event = order;

    const repositories = jest.fn().mockResolvedValue({
      Order: { create: jest.fn().mockRejectedValue(false) },
      OrderItem: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn().mockReturnValue(true),
        isValidDate: jest.fn().mockReturnValue(true),
        formatDate: jest.fn().mockReturnValue(true),
        isValidProductGroup: jest.fn().mockResolvedValue(true),
        haveCreditAvailable: jest.fn().mockResolvedValue(true),
        haveExistingLocks: jest.fn().mockResolvedValue(true),
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
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500, data) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
        data,
      })),
    };

    const { createOrder } = handlerOrder({ repositories, experts, res });

    await createOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.order.isValidDate.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(experts.order.formatDate.mock.calls).toEqual([
      [
        true,
      ],
    ]);


    // expect(experts.order.isValidProductGroup.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveCreditAvailable.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveExistingLocks.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.create.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    const { OrderItem } = await repositories();
    expect(OrderItem.create.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

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
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return an unhandled error in case an OrderItem cannot be saved.', async () => {

    const event = order;

    const repositories = jest.fn().mockResolvedValue({
      Order: { create: jest.fn().mockResolvedValue(true) },
      OrderItem: { create: jest.fn().mockRejectedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn().mockReturnValue(true),
        isValidDate: jest.fn().mockReturnValue(true),
        formatDate: jest.fn().mockReturnValue(true),
        isValidProductGroup: jest.fn().mockResolvedValue(true),
        haveCreditAvailable: jest.fn().mockResolvedValue(true),
        haveExistingLocks: jest.fn().mockResolvedValue(true),
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
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500, data) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
        data,
      })),
    };

    const { createOrder } = handlerOrder({ repositories, experts, res });
    await createOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(experts.order.isValidDate.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(experts.order.formatDate.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    // expect(experts.order.isValidProductGroup.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveCreditAvailable.mock.calls).toEqual([ [] ]);
    // expect(experts.order.haveExistingLocks.mock.calls).toEqual([ [] ]);

    const { Order, closeConnection } = await repositories();
    expect(Order.create.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    const { OrderItem } = await repositories();
    expect(OrderItem.create.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

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
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

});