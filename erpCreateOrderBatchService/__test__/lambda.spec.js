const handler = require('../lambda');

describe('Lambda Function', () => {

  it('It should answer a status 200.', async () => {

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByStatus: jest.fn().mockResolvedValue(true),
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

    const operations = { transactions: jest.fn().mockResolvedValue(true) };

    const res = {
      sendStatus: jest.fn(code => ({ httpStatus: code })),
      error: jest.fn(),
    };

    const lodash = { isEmpty: jest.fn().mockReturnValue(false) };

    const { erpCreateBatchOrder } = handler({ repositories, getErpConfig, erpManager, experts, operations, res, lodash });

    const result = await erpCreateBatchOrder({});

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByStatus.mock.calls).toEqual([ [] ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([ [ {} ] ]);

    expect(operations.transactions.mock.calls).toEqual([
      [
        erpManager,
        Order,
        OrderLog,
        true,
      ],
    ]);

    expect(result).toEqual({ httpStatus: 200 });
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should return a server_error in case of an unhandled error.', async () => {
    const repositories = jest.fn().mockResolvedValue({
      Order: {
        getByStatus: jest.fn().mockRejectedValue([]),
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

    const operations = { transactions: jest.fn().mockResolvedValue(true) };

    const res = {
      sendStatus: jest.fn(code => ({ httpStatus: code })),
      error: jest.fn(),
    };

    const { erpCreateBatchOrder } = handler({ repositories, getErpConfig, erpManager, experts, operations, res });

    await erpCreateBatchOrder({});

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getErpConfig.mock.calls).toEqual([ [] ]);

    const { Order, OrderLog, closeConnection } = await repositories();
    expect(Order.getByStatus.mock.calls).toEqual([ [] ]);

    expect(erpManager.updateConfig.mock.calls).toEqual([]);

    expect(operations.transactions.mock.calls).toEqual([]);

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