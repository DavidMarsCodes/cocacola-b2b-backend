const order = require('../../../services/order/create');

describe('Set Method', () => {
  it('Deberia setear una  nueva order', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '', // Solo se envía si ya existe
      deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
      deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          deliveryType: 'delivery',
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
      orderId: '',
    };

    const Order = { create: jest.fn().mockResolvedValue({ orderId: 1 }) };

    const Discount = {
      getAllExclusions: jest.fn().mockResolvedValue([
        {
          allowUserSelection: true,
          calculationType: 'P',
          discountId: 4,
          discountType: 'S',
          image: 'discounts/001_AR_3043_test-03.jpg',
          maxRepetitionAllowed: 3,
          name: 'Escala',
          requirements: {
            name: 'Coca Cola Retornable 2.25 L',
            price: { listPrice: 200 },
            productId: 10,
            scales: [
              {
                max: 10,
                min: 1,
                reward: { value: 0.12 },
              },
              {
                max: 20,
                min: 11,
                reward: { value: 0.15 },
              },
            ],
          },
        },
      ]),
    };

    const experts = {
      order: {
        isValidRequiredData: jest.fn(),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue('2021-01-21T00:00:00.000Z'),
        handlersDatabaseError: jest.fn(),
      },
    };

    const redis = {
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
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
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
    };

    const cognito = { getApplicationClientName: jest.fn().mockResolvedValue('b2b-koboss-appclient-dev') };

    const getSourceChannel = jest.fn().mockReturnValue('KOBOSS');

    const result = await order.set({ event, experts, cognito, getSourceChannel, params, Order, Discount, redis });

    expect(experts.order.isValidDate.mock.calls).toEqual([
      [
        '2021-01-21T00:00:00.000Z',
      ],
    ]);

    expect(experts.order.formatDate.mock.calls).toEqual([
      [
        '2021-01-21T00:00:00.000Z',
      ],
    ]);

    expect(cognito.getApplicationClientName.mock.calls).toEqual([
      [],
    ]);

    expect(getSourceChannel.mock.calls).toEqual([
      [
        'b2b-koboss-appclient-dev',
      ],
    ]);

    expect(Order.create.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          sourceChannel: 'KOBOSS',
          clientId: 2,
          orderId: '',
          status: 'initiated', // Solo se envía si ya existe
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          orderDeliveryDate: '2021-01-21T00:00:00.000Z',
          items: [
            {
              portfolioPriceId: 14,
              productId: 9,
              deliveryType: 'delivery',
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
        },
      ],
    ]);

    expect(redis.discountExclusions.upsert.mock.calls).toEqual([
      [
        event,
        [
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
        ],
      ],
    ]);

    expect(Discount.getAllExclusions.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
        },
      ],
    ]);

    expect(redis.discountExclusions.upsert.mock.calls).toEqual([
      [
        event,
        [
          {
            allowUserSelection: true,
            calculationType: 'P',
            discountId: 4,
            discountType: 'S',
            image: 'discounts/001_AR_3043_test-03.jpg',
            maxRepetitionAllowed: 3,
            name: 'Escala',
            requirements: {
              name: 'Coca Cola Retornable 2.25 L',
              price: { listPrice: 200 },
              productId: 10,
              scales: [
                {
                  max: 10,
                  min: 1,
                  reward: { value: 0.12 },
                },
                {
                  max: 20,
                  min: 11,
                  reward: { value: 0.15 },
                },
              ],
            },
          },
        ],
      ],
    ]);

    expect(result).toEqual({
      orderClient: { orderId: 1 },
      exclusionsArray: [
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
      ],
    });

  });
});