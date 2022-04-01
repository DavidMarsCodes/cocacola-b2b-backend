const { createOrUpdate } = require('../../../services/strategies/strategy/create');

describe('create', () => {

  it('creating dates if no info in redis', async () => {

    const opdates = {};

    const operationDates = jest.fn().mockResolvedValue({
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
    });

    const createMethod = await createOrUpdate({ opdates, operationDates });
    expect(createMethod).toEqual(operationDates);
  });
});