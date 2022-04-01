const processOrder = require('../../../services/processOrder/strategy');

describe('', () => {
  it('should exist discount in dynamoDB and execute process order', async () => {
    const discountsHandler = {
      processOrder: jest.fn().mockReturnValue([ {
        discountId: 4,
        discountType: 'S',
        calculationType: 'P',
        image: 'discounts/001_AR_3043_test-03.jpg',
        name: 'Escala',
        maxRepetitionAllowed: 3,
        allowUserSelection: true,
        requirements: {
          scales: [ {
            min: 1,
            max: 10,
            reward: { value: 0.12 },
          },
          {
            min: 11,
            max: 20,
            reward: { value: 0.15 },
          } ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      } ]),
      processDiscounts: jest.fn().mockReturnValue({}),
      calcOtherDiscounts: jest.fn().mockReturnValue({}),
      taxCalculator: jest.fn().mockResolvedValue({
        items: [
          {
            portfolioPriceId: 14,
            productId: 9,
            quantity: 2,
            price: {
              listPrice: 100,
              finalPrice: 0,
            },
            taxes: 65.5,
            discounts: 0,
            others: 0,
            productGroupId: 7,
            shippingPrice: 50,
          },
          {
            portfolioPriceId: 15,
            productId: 10,
            quantity: 2,
            price: {
              listPrice: 100,
              finalPrice: 0,
            },
            taxes: 35.2,
            discounts: 0,
            others: 0,
            productGroupId: 7,
            shippingPrice: 20,
          },
        ],
        metadataTaxes: '',
      }),
      applyRounds: jest.fn(),
      createDiscountEntitiesDomain: jest.fn().mockReturnValue([ {} ]),
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devDiscountDomainModel: {
              Item: {
                domainModelId: id,
                cpgId: '001',
                countryId: 'CL',
                organizationId: '3043',
                clientId: 6,
                pricesDate: '2021-09-13',
                discounts: [],
              },
            },
            devParameters: {
              Item: {
                statusArray: [
                  {},
                ],
                transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
                paramId: '001-AR-3046',
                params: {
                  DATE_FOR_OPERATIONS: 'DELIVERY_DATE',
                  ROUND_PRESICION: '2',
                },
              },
            },
          };

          return tableSelected[tablaName];
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const dbRedis = jest.fn().mockResolvedValue({
      clientDiscountDomainModel: {
        get: jest.fn().mockResolvedValue({
          domainModelId: 1,
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 6,
          pricesDate: '2021-09-13',
          discounts: [],
        }),
      },
    });

    const builder = {
      buildRequireParams: jest.fn().mockReturnValue({
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: 2,
        deliverydate: '2021-01-30T00:00:00',
      }),
      buildKeyTable: jest.fn().mockReturnValue({}),
      buidKeyTableDiscountDomainModel: jest.fn().mockReturnValue('001-CL-3043-6-202100913'),
      buidSortKeyTableDiscountDomainModel: jest.fn().mockReturnValue('001-CL-3043-2022-02-07'),
    };

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 124, // Solo se envía si ya existe
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
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const priceDateByCountry = '2021-09-02T00:00:00.000Z';

    const exclusionsArray = [];

    const DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL = 'devDiscountDomainModel';

    const rawDiscountData = [
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
            {
              min: 1,
              max: 10,
              reward: { value: 0.12 },
            },
            {
              min: 11,
              max: 20,
              reward: { value: 0.15 },
            },
          ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      },
    ];

    const res = await processOrder({ discountsHandler, dbRedis, builder })(event, rawDiscountData, exclusionsArray, priceDateByCountry, DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL);

    // expect(builder.buidKeyTableDiscountDomainModel.mock.calls).toEqual([
    //   [
    //     {
    //       transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
    //       cpgId: '001',
    //       countryId: 'AR',
    //       organizationId: '3043',
    //       clientId: 2,
    //       orderId: 124, // Solo se envía si ya existe
    //       orderDeliveryDate: '2021-01-21T00:00:00.000Z',
    //       items: [
    //         {
    //           portfolioPriceId: 14,
    //           productId: 9,
    //           quantity: 2,
    //           price: {
    //             listPrice: 100,
    //             finalPrice: 0,
    //           },
    //           taxes: 20,
    //           discounts: 0,
    //           others: 0,
    //           productGroupId: 7,
    //         },
    //         {
    //           portfolioPriceId: 15,
    //           productId: 10,
    //           quantity: 2,
    //           price: {
    //             listPrice: 100,
    //             finalPrice: 0,
    //           },
    //           taxes: 20,
    //           discounts: 0,
    //           others: 0,
    //           productGroupId: 7,
    //         },
    //       ],
    //       b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    //     },
    //     '2021-09-02T00:00:00.000Z',
    //   ],
    // ]);

    const redis = await dbRedis();
    expect(redis.clientDiscountDomainModel.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124, // Solo se envía si ya existe
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
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '2021-09-02T00:00:00.000Z',
      ],
    ]);

    expect(discountsHandler.processOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124, // Solo se envía si ya existe
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
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        [],
        [],
      ],
    ]);
    expect(discountsHandler.createDiscountEntitiesDomain.mock.calls).toEqual([]);
    expect(res).toEqual([
      {
        discountId: 4,
        discountType: 'S',
        calculationType: 'P',
        image: 'discounts/001_AR_3043_test-03.jpg',
        name: 'Escala',
        maxRepetitionAllowed: 3,
        allowUserSelection: true,
        requirements: {
          scales: [ {
            min: 1,
            max: 10,
            reward: { value: 0.12 },
          },
          {
            min: 11,
            max: 20,
            reward: { value: 0.15 },
          } ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      },
    ]);
  });

  it('should ', async () => {
    const discountsHandler = {
      processOrder: jest.fn().mockReturnValue([ {
        discountId: 4,
        discountType: 'S',
        calculationType: 'P',
        image: 'discounts/001_AR_3043_test-03.jpg',
        name: 'Escala',
        maxRepetitionAllowed: 3,
        allowUserSelection: true,
        requirements: {
          scales: [ {
            min: 1,
            max: 10,
            reward: { value: 0.12 },
          },
          {
            min: 11,
            max: 20,
            reward: { value: 0.15 },
          } ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      } ]),
      processDiscounts: jest.fn().mockReturnValue({}),
      calcOtherDiscounts: jest.fn().mockReturnValue({}),
      taxCalculator: jest.fn().mockResolvedValue({
        items: [
          {
            portfolioPriceId: 14,
            productId: 9,
            quantity: 2,
            price: {
              listPrice: 100,
              finalPrice: 0,
            },
            taxes: 65.5,
            discounts: 0,
            others: 0,
            productGroupId: 7,
            shippingPrice: 50,
          },
          {
            portfolioPriceId: 15,
            productId: 10,
            quantity: 2,
            price: {
              listPrice: 100,
              finalPrice: 0,
            },
            taxes: 35.2,
            discounts: 0,
            others: 0,
            productGroupId: 7,
            shippingPrice: 20,
          },
        ],
        metadataTaxes: '',
      }),
      applyRounds: jest.fn(),
      createDiscountEntitiesDomain: jest.fn().mockReturnValue([
        {
          productId: 5,
          quantity: 1,
          name: 'Coca-Cola Botella Plástico No Retornable 1.5L 1X6',
          productGroupName: 'Sin macrocategoria',
          price: {
            listPrice: 4863,
            finalPrice: 4863,
            shippingPrice: 0,
            taxes: 0,
            others: 0,
            discounts: 0,
            accumulatedDiscounts: [],
          },
          portfolioPriceId: 3786,
          suggestedProduct: { isSuggested: false, quantity: 0 },
          productGroup: { category: 'Bebidas', macroCategory: 'Sin macrocategoria' },
          erpProductId: '000000000000120120',
        },
      ]),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      clientDiscountDomainModel: {
        get: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue({}),
      },
    });

    const builder = {
      buildRequireParams: jest.fn().mockReturnValue({
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: 2,
        deliverydate: '2021-01-30T00:00:00',
      }),
      buildKeyTable: jest.fn().mockReturnValue({}),
      buidKeyTableDiscountDomainModel: jest.fn().mockReturnValue('001-CL-3043-6-202100913'),
      buidSortKeyTableDiscountDomainModel: jest.fn().mockReturnValue('001-CL-3043-2022-02-07'),
    };

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 124, // Solo se envía si ya existe
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
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const priceDateByCountry = '2021-09-02T00:00:00.000Z';

    const exclusionsArray = [];

    const DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL = 'devDiscountDomainModel';

    const rawDiscountData = [
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
            {
              min: 1,
              max: 10,
              reward: { value: 0.12 },
            },
            {
              min: 11,
              max: 20,
              reward: { value: 0.15 },
            },
          ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      },
    ];

    const res = await processOrder({ discountsHandler, dbRedis, builder })(event, rawDiscountData, exclusionsArray, priceDateByCountry, DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL);

    const redis = await dbRedis();
    expect(redis.clientDiscountDomainModel.get.mock.calls).toEqual([
      [
        event,
        '2021-09-02T00:00:00.000Z',
      ],
    ]);

    // expect(redis.clientDiscountDomainModel.upsert.mock.calls).toEqual([
    //   [
    //   ],
    // ]);

    expect(discountsHandler.createDiscountEntitiesDomain.mock.calls).toEqual([
      [
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
                {
                  min: 1,
                  max: 10,
                  reward: { value: 0.12 },
                },
                {
                  min: 11,
                  max: 20,
                  reward: { value: 0.15 },
                },
              ],
              productId: 10,
              name: 'Coca Cola Retornable 2.25 L',
              price: { listPrice: 200 },
            },
          },
        ],
        '2021-09-02T00:00:00.000Z',
        true,
      ],
    ]);
    // expect(awsRepositories.Repository.create.mock.calls).toEqual([
    //   [
    //     'devDiscountDomainModel',
    //     {
    //       clientId: 2,
    //       countryId: 'AR',
    //       cpgId: '001',
    //       discountValidityDate: '001-CL-3043-2022-02-07',
    //       discounts: [
    //         {
    //           erpProductId: '000000000000120120',
    //           name: 'Coca-Cola Botella Plástico No Retornable 1.5L 1X6',
    //           portfolioPriceId: 3786,
    //           price: {
    //             accumulatedDiscounts: [],
    //             discounts: 0,
    //             finalPrice: 4863,
    //             listPrice: 4863,
    //             others: 0,
    //             shippingPrice: 0,
    //             taxes: 0,
    //           },
    //           productGroup: {
    //             category: 'Bebidas',
    //             macroCategory: 'Sin macrocategoria',
    //           },
    //           productGroupName: 'Sin macrocategoria',
    //           productId: 5,
    //           quantity: 1,
    //           suggestedProduct: {
    //             isSuggested: false,
    //             quantity: 0,
    //           },
    //         },
    //       ],
    //       domainModelId: '001-CL-3043-6-202100913',
    //       organizationId: '3043',
    //       pricesDate: '2021-09-02T00:00:00.000Z',
    //     },
    //   ],
    // ]);
    expect(discountsHandler.processOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124, // Solo se envía si ya existe
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
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        [
          {
            productId: 5,
            quantity: 1,
            name: 'Coca-Cola Botella Plástico No Retornable 1.5L 1X6',
            productGroupName: 'Sin macrocategoria',
            price: {
              listPrice: 4863,
              finalPrice: 4863,
              shippingPrice: 0,
              taxes: 0,
              others: 0,
              discounts: 0,
              accumulatedDiscounts: [],
            },
            portfolioPriceId: 3786,
            suggestedProduct: { isSuggested: false, quantity: 0 },
            productGroup: { category: 'Bebidas', macroCategory: 'Sin macrocategoria' },
            erpProductId: '000000000000120120',
          },
        ],
        [],
      ],
    ]);
    expect(res).toEqual([
      {
        discountId: 4,
        discountType: 'S',
        calculationType: 'P',
        image: 'discounts/001_AR_3043_test-03.jpg',
        name: 'Escala',
        maxRepetitionAllowed: 3,
        allowUserSelection: true,
        requirements: {
          scales: [ {
            min: 1,
            max: 10,
            reward: { value: 0.12 },
          },
          {
            min: 11,
            max: 20,
            reward: { value: 0.15 },
          } ],
          productId: 10,
          name: 'Coca Cola Retornable 2.25 L',
          price: { listPrice: 200 },
        },
      },
    ]);
  });
});