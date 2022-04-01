const handler = require('../lambda');

describe('Lambda Function', () => {

  it('You should update the billing closing plan.', async () => {

    const data = {
      Records: [
        { dynamodb: { NewImage: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } } } },
      ],
    };

    const respositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlan: {},
      InvoiceDeadlinePlanItem: {},
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockResolvedValue({
          Item: {
            cpgId: '001',
            countryId: 'AR',
            organizationId: '3043',
          },
        }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devInvoicePlanToUpsert',
      tableNameError: 'devInvoicePlanToUpsertErrors',
    });

    const experts = {};

    const operations = { transactions: jest.fn().mockResolvedValue(true) };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertInvoicePlan } = handler({ respositories, awsRepositories, getTableName, experts, operations, res });

    await upsertInvoicePlan(data);

    expect(respositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([ [
      'devInvoicePlanToUpsert',
      { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
    ] ]);

    expect(res.sendStatus.mock.calls).toEqual([ [ 200 ] ]);

    const { closeConnection } = await respositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });

  it('It should handle an error because an asynchronous task cannot be completed.', async () => {

    const data = {
      Records: [
        { dynamodb: { NewImage: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } } } },
      ],
    };

    const respositories = jest.fn().mockResolvedValue({
      InvoiceDeadlinePlan: {},
      InvoiceDeadlinePlanItem: {},
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockResolvedValue({ ok: true }),
        get: jest.fn().mockRejectedValue({ ok: false }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devInvoicePlanToUpsert',
      tableNameError: 'devInvoicePlanToUpsertErrors',
    });

    const experts = {};

    const operations = { transactions: jest.fn().mockResolvedValue(true) };

    const res = {
      sendStatus: jest.fn(),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertInvoicePlan } = handler({ respositories, awsRepositories, getTableName, experts, operations, res });

    await upsertInvoicePlan(data);

    expect(respositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([ [
      'devInvoicePlanToUpsert',
      { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
    ] ]);

    expect(operations.transactions).not.toHaveBeenCalled();
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        '{"ok":false}',
      ],
    ]);

    const { closeConnection } = await respositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});