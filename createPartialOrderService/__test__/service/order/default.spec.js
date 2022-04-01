const order = require('../../../services/order/default');

describe('Set Method', () => {
  it('I should set a order for orderId', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 1234, // Solo se envía si ya existe
      orderDeliveryDate: '2021-01-21T00:00:00.000Z',
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
          },
          taxes: 20,
          discounts: 0,
          others: 0,
          productGroupId: 7,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
          },
          taxes: 20,
          discounts: 0,
          others: 0,
          productGroupId: 7,
        },
      ],
    };

    const params = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 1234,
    };

    const Discount = { getAllExclusions: jest.fn().mockResolvedValue([]) };

    const redis = {
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue(null),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue(null),
      },
      clientDataLoaded: {
        get: jest.fn().mockResolvedValue([
          {
            discountId: 4,
            discountType: 'S',
            calculationType: 'P',
            image: 'discounts/001_AR_3043_test-03.jpg',
            name: 'Escala',
            maxRepetitionAllowed: 3,
            allowUserSelection: true,
            requirements: {
              scales: [
                { min: 1, max: 10, reward: { value: 0.12 } },
                { min: 11, max: 20, reward: { value: 0.15 } },
              ],
              productId: 10,
              name: 'Coca Cola Retornable 2.25 L',
              price: { listPrice: 200 },
            },
          },
        ]),
      },
    };

    const result = await order.set({ event, params, Discount, redis });

    expect(redis.discountExclusions.get.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(Discount.getAllExclusions.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 1234,
        },
      ],
    ]);

    expect(result).toEqual({
      orderClient: { orderId: 1234 },
      exclusionsArray: [],
    });

  });
});