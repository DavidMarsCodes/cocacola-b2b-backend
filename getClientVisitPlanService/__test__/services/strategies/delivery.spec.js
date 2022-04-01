const handler = require('../../../services/strategies/visitTypeSterategy/delivery');

describe('delivery strategy', () => {
  it('It should return visit plans', async () => {
    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
      clientId: 2,
      offset: 0,
      limit: 100,
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

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const Client = { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) };

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

    const InvoiceDeadlinePlanItem = { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) };

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn(),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(true),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn(),
        buildCurrentDate: jest.fn().mockReturnValue('2021-07-07T15:52:59.553-03:00'),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };


    const luxon = {
      DateTime: {
        utc: jest.fn().mockReturnValue({
          toISODate: jest.fn().mockReturnValue('2021-07-05'),
          toISO: jest.fn().mockReturnValue('2021-07-05T18:48:02-03:00'),
        }),
      },
    };

    const { getVisitPlan } = handler({ experts, luxon });
    const result = await getVisitPlan({ Client, VisitPlan, InvoiceDeadlinePlanItem, data });

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
    expect(luxon.DateTime.utc.mock.calls).toEqual([ [], [] ]);
    expect(luxon.DateTime.utc().toISODate.mock.calls).toEqual([ [], [] ]);
    expect(experts.visitPlan.addDeliveryCondition.mock.calls).toEqual([]);
    expect(VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate.mock.calls).toEqual([
      [
        {
          clientId: 2,
          offRoute: true,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
          limit: 100,
          offset: 0,
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
          data: undefined,
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
          deliveryDate: '2021-07-05',
        },
      ],
    ]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        6,
        '2021-07-05',
        {
          clientId: 2,
          limit: 100,
          offRoute: true,
          offset: 0,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
        {
          clientId: 2,
          invoiceDeadlinePlanId: 6,
          limit: 100,
          offRoute: true,
          offset: 0,
          today: '2021-07-05',
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.visitPlan.buildDeadlineDate.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
      ],
    ]);
    expect(experts.visitPlan.buildCurrentDate.mock.calls).toEqual([
      [
        '-3:',
      ],
    ]);
    expect(experts.visitPlan.compareCurrentDateWithDeadlineDate).toHaveBeenCalled();
    expect(experts.visitPlan.removeFirstVisitPlan.mock.calls).toEqual([
      [
        [
          {
            clientId: 2,
            limit: 100,
            offRoute: true,
            offset: 0,
            visitDate: "2021-10-30T12:34:56'Z'",
            visitType: 'delivery',
          },
        ],
      ],
    ]);
    expect(result).toEqual({
      count: 10,
      currentPage: 1,
      data: undefined,
    });
  });

  it('It should return visit plans for a client with a deliveryCondition.', async () => {
    const clientData = {
      deliveryCondition: 48,
      invoiceDeadlinePlanId: 6,
    };

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
      clientId: 2,
      offset: 0,
      limit: 100,
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

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const Client = { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) };

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

    const InvoiceDeadlinePlanItem = { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) };

    const experts = {
      visitPlan: {
        validGetClientVisitPlanRequiredParams: jest.fn(),
        validPaginationParams: jest.fn().mockReturnValue({ offset: event.offset, limit: event.limit }),
        createValidDeliveryDate: jest.fn().mockReturnValue(true),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(),
        buildDeadlineDate: jest.fn(),
        compareCurrentDateWithDeadlineDate: jest.fn().mockReturnValue(true),
        removeFirstVisitPlan: jest.fn(),
        addDeliveryCondition: jest.fn().mockReturnValue('2021-07-09'),
        buildCurrentDate: jest.fn().mockReturnValue('2021-07-07T15:52:59.553-03:00'),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };


    const luxon = {
      DateTime: {
        utc: jest.fn().mockReturnValue({
          toISODate: jest.fn().mockReturnValue('2021-07-05'),
          toISO: jest.fn().mockReturnValue('2021-07-05T18:48:02-03:00'),
        }),
      },
    };

    const { getVisitPlan } = handler({ experts, luxon });
    const result = await getVisitPlan({ Client, VisitPlan, InvoiceDeadlinePlanItem, data });

    expect(Client.getDeliveryConditionAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        2,
      ],
    ]);
    expect(experts.client.validateExistsResult.mock.calls).toEqual([
      [
        {
          deliveryCondition: 48,
          invoiceDeadlinePlanId: 6,
        },
      ],
    ]);
    expect(luxon.DateTime.utc.mock.calls).toEqual([ [], [] ]);
    expect(luxon.DateTime.utc().toISODate.mock.calls).toEqual([ [], [] ]);
    expect(experts.visitPlan.addDeliveryCondition.mock.calls).toEqual([ [ 48 ] ]);
    expect(VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate.mock.calls).toEqual([
      [
        {
          clientId: 2,
          offRoute: true,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
          limit: 100,
          offset: 0,
        },
        '2021-07-09',
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
          deliveryDate: '2021-07-09',
        },
      ],
    ]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        6,
        '2021-07-05',
        {
          clientId: 2,
          limit: 100,
          offRoute: true,
          offset: 0,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
        {
          clientId: 2,
          invoiceDeadlinePlanId: 6,
          limit: 100,
          offRoute: true,
          offset: 0,
          today: '2021-07-09',
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.visitPlan.buildDeadlineDate.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
      ],
    ]);
    expect(experts.visitPlan.buildCurrentDate.mock.calls).toEqual([
      [
        '-3:',
      ],
    ]);
    expect(experts.visitPlan.compareCurrentDateWithDeadlineDate).toHaveBeenCalled();
    expect(experts.visitPlan.removeFirstVisitPlan.mock.calls).toEqual([]);
    expect(result).toEqual({
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

  it('You should return visit plans for when it is not the current date after the due date', async () => {
    const clientData = {
      deliveryCondition: 0,
      invoiceDeadlinePlanId: 6,
    };

    const data = {
      visitDate: "2021-10-30T12:34:56'Z'",
      visitType: 'delivery',
      offRoute: true,
      clientId: 2,
      offset: 0,
      limit: 100,
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

    const invoiceDeadlinePlanItem = {
      deadlineDate: '2021-01-02',
      deadlineTime: '16:30:00',
      timezone: '-3:',
    };

    const Client = { getDeliveryConditionAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(clientData) };

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

    const InvoiceDeadlinePlanItem = { getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId: jest.fn().mockResolvedValue(invoiceDeadlinePlanItem) };

    const experts = {
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
        buildCurrentDate: jest.fn().mockReturnValue('2021-07-07T15:52:59.553-03:00'),
      },
      client: { validateExistsResult: jest.fn() },
      invoiceDeadlinePlanItem: { validateExistsResult: jest.fn() },
    };


    const luxon = {
      DateTime: {
        utc: jest.fn().mockReturnValue({
          toISODate: jest.fn().mockReturnValue('2021-07-05'),
          toISO: jest.fn().mockReturnValue('2021-07-05T18:48:02-03:00'),
        }),
      },
    };

    const { getVisitPlan } = handler({ experts, luxon });
    await getVisitPlan({ Client, VisitPlan, InvoiceDeadlinePlanItem, data });

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
    expect(luxon.DateTime.utc.mock.calls).toEqual([ [], [] ]);
    expect(luxon.DateTime.utc().toISODate.mock.calls).toEqual([ [], [] ]);
    expect(VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate.mock.calls).toEqual([
      [
        {
          clientId: 2,
          offRoute: true,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
          limit: 100,
          offset: 0,
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
          deliveryDate: '2021-07-05',
        },
      ],
    ]);
    expect(InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId.mock.calls).toEqual([
      [
        6,
        '2021-07-05',
        {
          clientId: 2,
          limit: 100,
          offRoute: true,
          offset: 0,
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.invoiceDeadlinePlanItem.validateExistsResult.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
        {
          clientId: 2,
          invoiceDeadlinePlanId: 6,
          limit: 100,
          offRoute: true,
          offset: 0,
          today: '2021-07-05',
          visitDate: "2021-10-30T12:34:56'Z'",
          visitType: 'delivery',
        },
      ],
    ]);
    expect(experts.visitPlan.buildDeadlineDate.mock.calls).toEqual([
      [
        {
          deadlineDate: '2021-01-02',
          deadlineTime: '16:30:00',
          timezone: '-3:',
        },
      ],
    ]);
    expect(experts.visitPlan.compareCurrentDateWithDeadlineDate).toHaveBeenCalled();
    expect(experts.visitPlan.removeFirstVisitPlan.mock.calls).toEqual([]);
  });
});