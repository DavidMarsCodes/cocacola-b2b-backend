const handler = require('../../../services/strategies/visitTypeSterategy/others');

describe('delivery strategy', () => {
  it('It should return visit plans', async () => {
    const luxon = { DateTime: { utc: jest.fn().mockReturnValue({ toISODate: jest.fn().mockReturnValue('2021-07-05') }) } };

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
      clientId: 2,
      offset: 0,
      limit: 100,
    };

    const VisitPlan = {
      getVisitPlansByVisitTypeAndDeliveryDate: jest.fn().mockResolvedValue({
        currentPage: 1,
        count: 10,
        data: [
          {
            visitDate: "2021-10-30T12:34:56'Z'",
            visitType: 'delivery',
            offRoute: true,
            clientId: 2,
            offset: 0,
            limit: 100,
          },
        ],
      }),
    };

    const experts = { visitPlan: { validateExistsResult: jest.fn() } };

    const { getVisitPlan } = handler({ experts, luxon });
    const res = await getVisitPlan({ VisitPlan, data });

    expect(luxon.DateTime.utc.mock.calls).toEqual([ [] ]);
    expect(luxon.DateTime.utc().toISODate.mock.calls).toEqual([ [] ]);
    expect(VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate.mock.calls).toEqual([
      [
        {
          clientId: 2,
          limit: 100,
          offRoute: true,
          offset: 0,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
        '2021-07-05',
        0,
        100,
      ],
    ]);
    expect(experts.visitPlan.validateExistsResult.mock.calls).toEqual([
      [
        {
          count: 10,
          currentPage: 1,
          data: [
            {
              clientId: 2,
              limit: 100,
              offRoute: true,
              offset: 0,
              visitDate: "2021-10-30T12:34:56'Z'",
              visitType: 'delivery',
            },
          ],
        },
        {
          data: {
            clientId: 2,
            limit: 100,
            offRoute: true,
            offset: 0,
            visitDate: "2021-10-30T12:34:56'Z'",
            visitType: 'delivery',
          },
          today: '2021-07-05',
        },
      ],
    ]);
    expect(res).toEqual({
      count: 10,
      currentPage: 1,
      data: [
        {
          clientId: 2,
          limit: 100,
          offRoute: true,
          offset: 0,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    });
  });
});