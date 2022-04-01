const handler = require('../lambda');

describe('Lambda Function', () => {

  it('upsertOrderHistory.', async () => {

    const data = {
      Records: [
        { dynamodb: { NewImage: { transactionId: { S: '16fefcc2-28e3-11eb-adc1-0242ac120002' } } } },
      ],
    };

    const repositories = jest.fn().mockResolvedValue({
      OrderHistory: {},
      Client: {},
      PaymentMethod: {},
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
            data: [],
          },
        }),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({
      tableName: 'devOrderHistoryToUpsert',
      tableNameError: 'devOrderHistoryToUpsertErrors',
    });

    const experts = {};

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn(),
    };

    const { upsertOrderHistory } = handler({ awsRepositories, repositories, getTableName, experts, res });

    await upsertOrderHistory(data);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([ [
      'devOrderHistoryToUpsert',
      { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
    ] ]);
    expect(res.sendStatus.mock.calls).toEqual([[201]]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});