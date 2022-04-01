const handler = require('../lambda');

describe('Lambda Function', () => {

  it('It should connect with in external ERP.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 16,
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByIdAndStatus: jest.fn().mockResolvedValue(true),
        updateStatus: jest.fn(),
      },
      OrderLog: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(),
    };

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn(),
    };

    const { erpCreateOrder } = handler({ repositories, getErpConfig, erpManager, experts, res });

    await erpCreateOrder(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByIdAndStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([
      [
        {},
      ],
    ]);

    expect(erpManager.save.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(Order.updateStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
        'delivered',
      ],
    ]);

    expect(OrderLog.create.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
          eventType: 'FIRST',
          eventResult: 'OK',
          eventInfo: `The operation has been successful. The order data was sent with id 16.`,
        },

      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([ [ 202 ] ]);
    expect(res.error.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('You should update the failed status in case you receive an error code.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 16,
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByIdAndStatus: jest.fn().mockResolvedValue(true),
        updateStatus: jest.fn(),
      },
      OrderLog: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockRejectedValue({
        code: 'ECONNREFUSED',
        message: 'ERROR DESCRIPTION',
        toJSON: jest.fn().mockReturnValue({ message: 'ERROR DESCRIPTION' }),
      }),
    };

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn(),
    };

    const { erpCreateOrder } = handler({ repositories, getErpConfig, erpManager, experts, res });

    await erpCreateOrder(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByIdAndStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([
      [
        {},
      ],
    ]);

    expect(erpManager.save.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(Order.updateStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
        'failed',
      ],
    ]);

    expect(OrderLog.create.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
          eventType: 'FIRST',
          eventResult: 'ERROR',
          eventInfo: 'ERROR DESCRIPTION',
        },

      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'ERROR DESCRIPTION',
        5010,
        'order_error',
        400,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('You must log the failed state in case you receive a timeOut error.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 16,
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByIdAndStatus: jest.fn().mockResolvedValue(true),
        updateStatus: jest.fn(),
      },
      OrderLog: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'ERROR DESCRIPTION',
        toJSON: jest.fn().mockReturnValue({ message: 'ERROR DESCRIPTION' }),
      }),
    };

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn(),
    };

    const { erpCreateOrder } = handler({ repositories, getErpConfig, erpManager, experts, res });

    await erpCreateOrder(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByIdAndStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([
      [
        {},
      ],
    ]);

    expect(erpManager.save.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(Order.updateStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
        'failed',
      ],
    ]);

    expect(OrderLog.create.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
          eventType: 'FIRST',
          eventResult: 'ERROR',
          eventInfo: 'The  conection time out expired.',
        },
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'ERROR DESCRIPTION',
        5010,
        'order_error',
        400,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return an error in case of not finding an order with the indicated orderId and the CREATED status.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 16,
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByIdAndStatus: jest.fn().mockResolvedValue(true),
        updateStatus: jest.fn(),
      },
      OrderLog: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    };

    const experts = {
      order: {
        validateExistsResult: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'order_not_found',
              code: 5001,
              type: 'order_error',
              httpStatus: 404,
            }),
          };
        }),
      },
    };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn(),
    };

    const { erpCreateOrder } = handler({ repositories, getErpConfig, erpManager, experts, res });

    await erpCreateOrder(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByIdAndStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          orderId: 16,
        },
      ],
    ]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [
        true,
      ],
    ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([]);

    expect(erpManager.save.mock.calls).toEqual([]);

    expect(Order.updateStatus.mock.calls).toEqual([]);

    expect(OrderLog.create.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'An order was not found that matches the orderId 16 and the CREATED state.',
        5001,
        'order_error',
        404,
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return an internal server error in case it is an unhandled error.', async () => {

    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      orderId: 16,
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByIdAndStatus: jest.fn().mockResolvedValue(true),
        updateStatus: jest.fn(),
      },
      OrderLog: { create: jest.fn().mockResolvedValue(true) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getErpConfig = jest.fn().mockRejectedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    };

    const experts = { order: { validateExistsResult: jest.fn() } };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn(),
    };

    const { erpCreateOrder } = handler({ repositories, getErpConfig, erpManager, experts, res });

    await erpCreateOrder(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByIdAndStatus.mock.calls).toEqual([]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([]);

    expect(erpManager.updateConfig.mock.calls).toEqual([]);

    expect(erpManager.save.mock.calls).toEqual([]);

    expect(Order.updateStatus.mock.calls).toEqual([]);

    expect(OrderLog.create.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);
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