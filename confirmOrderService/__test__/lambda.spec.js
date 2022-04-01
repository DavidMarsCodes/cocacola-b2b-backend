const handler = require('../lambda');

describe('Initial User Validations', () => {
  it('You should confirm an order if paymentMethod is CASH', async () => {

    const redisItems = [
      {
        productId: 66,
        deliveryType: 'delivery',
        quantity: 5,
        name: 'envase Generico RP 2 litr * 8',
        productGroupName: 'Sin macrocategoria',
        segmentId: 1,
        price: {
          listPrice: 2000,
          finalPrice: 2023,
          taxes: 380,
          discounts: 300,
          others: 0,
          shippingPrice: 0,
          accumulatedDiscounts: [],
          discountsApplied: [
            {
              discountAmount: 300,
              quantityCap: 10,
              wasApportioned: false,
              calculationBasis: 'basePrice',
              maxRepetitionAllowed: 10,
              sequence: 0,
              erpDiscountId: '0000027922',
              orderPosition: 633,
              amountCap: '0.000',
              erpDiscountClassId: 'ZA10',
              applyRestriction: true,
              discountType: 'CC',
              discountId: 59500,
              portfolioPriceId: 27631413,
              appliedDiscount: {
                calculationType: 'P',
                productId: 66,
                value: 0.15,
              },
            },
          ],
          finalTaxes: 323,
          taxesToApply: [
            0,
            323,
            0,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 323,
            },
          },
        },
        portfolioPriceId: 27631413,
        productGroup: {
          category: 'Sin categoria',
          macroCategory: 'Sin macrocategoria',
        },
        erpProductId: '000000000000027208',
        orderPosition: 660,
        totals: {
          finalTaxes: 1615,
          listPrice: 10000,
          shippingPrice: 0,
          taxes: 1900,
          others: 0,
          discounts: 1500,
          finalPrice: 10115,
        },
      },
      {
        productId: 1100,
        deliveryType: 'delivery',
        quantity: 5,
        name: 'Sprite Lima Limón Botella Plástico Retornable 2L 1X8',
        productGroupName: 'Sin macrocategoria',
        segmentId: 1,
        price: {
          listPrice: 6727,
          finalPrice: 9227,
          taxes: 2173,
          discounts: 653,
          others: 0,
          shippingPrice: 1170,
          accumulatedDiscounts: [
            {
              type: 'P',
              value: 0.097,
            },
          ],
          discountsApplied: [
            {
              discountAmount: 652.519,
              quantityCap: 999999,
              wasApportioned: false,
              calculationBasis: 'basePrice',
              maxRepetitionAllowed: 9999,
              sequence: 0,
              erpDiscountId: '0000005882',
              orderPosition: 533,
              amountCap: '99999999.000',
              erpDiscountClassId: 'ZA07',
              applyRestriction: false,
              discountType: 'P',
              discountId: 47310,
              portfolioPriceId: 27610667,
              appliedDiscount: {
                calculationType: 'P',
                productGroupDiscountId: 64346,
                value: 0.097,
              },
            },
          ],
          finalTaxes: 1983,
          taxesToApply: [
            0,
            1376.45139,
            607.4481,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 1376.45139,
            },
            IMPG: {
              erpTaxId: 'YIBA-0000862195',
              taxBase: 0,
              calculationBase: 'NETO',
              amount: 0,
              percentage: 0.1,
              value: 607.4481,
            },
          },
        },
        portfolioPriceId: 27610667,
        productGroup: {
          category: 'Bebidas',
          macroCategory: 'Sin macrocategoria',
        },
        productGroupDiscountIdList: [
          64346,
          64346,
        ],
        erpProductId: '000000000000121310',
        orderPosition: 1760,
        totals: {
          finalTaxes: 9919,
          listPrice: 33635,
          shippingPrice: 5850,
          taxes: 10865,
          others: 0,
          discounts: 3263,
          finalPrice: 46141,
        },
      },
      {
        productId: 402,
        deliveryType: 'delivery',
        quantity: 1,
        name: 'Cerv Budweiser Rba LT355cc 5g x12 ABCDEF',
        productGroupName: 'Sin macrocategoria',
        segmentId: 2,
        price: {
          listPrice: 9626,
          finalPrice: 13453,
          taxes: 3806,
          discounts: 0,
          others: 0,
          shippingPrice: 21,
          accumulatedDiscounts: [],
          finalTaxes: 3806,
          taxesToApply: [
            0,
            1832.93,
            1973.33,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 1832.93,
            },
            IMPG: {
              erpTaxId: 'YILV-0000860345',
              taxBase: 0,
              calculationBase: 'NETO',
              amount: 0,
              percentage: 0.205,
              value: 1973.33,
            },
          },
        },
        portfolioPriceId: 27631583,
        productGroup: {
          category: 'Sin categoria',
          macroCategory: 'Sin macrocategoria',
        },
        erpProductId: '000000000000127219',
        orderPosition: 4680,
        totals: {
          finalTaxes: 3806,
          listPrice: 9626,
          shippingPrice: 21,
          taxes: 3806,
          others: 0,
          discounts: 0,
          finalPrice: 13453,
        },
      },
    ];

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      orderId: '10000079',
      clientId: 92,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
      items: redisItems,
    };


    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };


    const repositories = jest.fn().mockResolvedValue({
      Order: {
        update: jest.fn().mockResolvedValue({}),
        getByOrderIdAndClientId: jest.fn().mockResolvedValue({ status: 'initiated' }),
      },
      OrderItem: { create: jest.fn().mockResolvedValue({}) },
      CreditLimit: {
        getAvailablesAndSegmentId: jest.fn().mockResolvedValue([
          { available: '945392.000', segmentId: 1 },
          { available: '945392.000', segmentId: 2 },
        ]),
      },
    });

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({ items: redisItems }) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
            { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      order: {
        isValidDataToConfirmOrder: jest.fn(),
        validateExistsResult: jest.fn(),
        validateIfOrderIsConfirmed: jest.fn().mockReturnValue(undefined),
        hasOperationDates: jest.fn(),
      },
    };
    const getTableNames = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME_CALCULATION_RESULT: 'devOrderCalculationSubTotalsBySegment' });

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devOrderCalculationSubTotalsBySegment: { id: '001-CL-3043-10000605-92' },
            devParameters: {
              Item: {
                id: '001-CL-3043-10000605-92',
                accumulatedBySegments: [
                  { segmentId: 1, subTotal: 2484 },
                  { segmentId: 2, subTotal: 10467 },
                ],
              },
            },
          };

          return tableSelected[tablaName];
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };

    const getInstanceQueue = jest.fn().mockResolvedValue({ send: jest.fn().mockResolvedValue() });

    const sendToSQS = jest.fn().mockResolvedValue({
      sqsRes: {
        ResponseMetadata: { RequestId: 'f180f73e-dd41-566d-81cc-ad40ea5e8210' },
        MD5OfMessageBody: '8f9398945a39d41437a5f07b664171bf',
        MessageId: '8f712b29-0219-44c7-96a6-6815b1894a10',
        SequenceNumber: '18867721442745072384',
      },
      message: {
        msgBody: {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 92,
          accumulatedBySegments: [
            { subTotal: 56256, segmentId: 1 },
            { subTotal: 13453, segmentId: 2 },
          ],
        },
        msgGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000370-92',
        msgDedupId: 'abb1b33c-8da5-437f-aecb-9905a4d88c4d',
      },
    });

    const uuid = { v4: jest.fn().mockReturnValue('1715ba2d-5b0b-4ba0-883b-c48a0de8a670') };

    const { confirmOrder } = await handler({ accessControl, repositories, experts, res, dbRedis, getTableNames, awsRepositories, getInstanceQueue, uuid, sendToSQS });

    await confirmOrder(event);

    expect(repositories.mock.calls).toEqual([[]]);

    expect(dbRedis.mock.calls).toEqual([[]]);

    expect(experts.order.isValidDataToConfirmOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: redisItems,
          organizationId: '3043',
          orderId: '10000079',
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Order, OrderItem } = await repositories();

    expect(Order.getByOrderIdAndClientId.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: redisItems,
          organizationId: '3043',
          orderId: '10000079',
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.order.validateIfOrderIsConfirmed.mock.calls).toEqual([
      [
        'initiated',
      ],
    ]);

    const redis = await dbRedis();

    expect(redis.order.get.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          countryId: 'CL',
          cpgId: '001',
          items: redisItems,
          orderId: '10000079',
          clientId: 92,
          organizationId: '3043',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
        '10000079',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([[]]);

    expect(OrderItem.create.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: redisItems,
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(Order.update.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: redisItems,
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        {
          status: 'created',
          orderDeliveryDate: '2021-05-20T00:00:00.000Z',
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          orderId: '10000079',
          itemsCreated: {},
        },
      ],
    ]);

  });

  it('You should confirm an order if paymentMethod is CREDIT', async () => {

    const redisItems = [
      {
        productId: 66,
        deliveryType: 'delivery',
        quantity: 5,
        name: 'envase Generico RP 2 litr * 8',
        productGroupName: 'Sin macrocategoria',
        segmentId: 1,
        price: {
          listPrice: 2000,
          finalPrice: 2023,
          taxes: 380,
          discounts: 300,
          others: 0,
          shippingPrice: 0,
          accumulatedDiscounts: [],
          discountsApplied: [
            {
              discountAmount: 300,
              quantityCap: 10,
              wasApportioned: false,
              calculationBasis: 'basePrice',
              maxRepetitionAllowed: 10,
              sequence: 0,
              erpDiscountId: '0000027922',
              orderPosition: 633,
              amountCap: '0.000',
              erpDiscountClassId: 'ZA10',
              applyRestriction: true,
              discountType: 'CC',
              discountId: 59500,
              portfolioPriceId: 27631413,
              appliedDiscount: {
                calculationType: 'P',
                productId: 66,
                value: 0.15,
              },
            },
          ],
          finalTaxes: 323,
          taxesToApply: [
            0,
            323,
            0,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 323,
            },
          },
        },
        portfolioPriceId: 27631413,
        productGroup: {
          category: 'Sin categoria',
          macroCategory: 'Sin macrocategoria',
        },
        erpProductId: '000000000000027208',
        orderPosition: 660,
        totals: {
          finalTaxes: 1615,
          listPrice: 10000,
          shippingPrice: 0,
          taxes: 1900,
          others: 0,
          discounts: 1500,
          finalPrice: 10115,
        },
      },
      {
        productId: 1100,
        deliveryType: 'delivery',
        quantity: 5,
        name: 'Sprite Lima Limón Botella Plástico Retornable 2L 1X8',
        productGroupName: 'Sin macrocategoria',
        segmentId: 1,
        price: {
          listPrice: 6727,
          finalPrice: 9227,
          taxes: 2173,
          discounts: 653,
          others: 0,
          shippingPrice: 1170,
          accumulatedDiscounts: [
            {
              type: 'P',
              value: 0.097,
            },
          ],
          discountsApplied: [
            {
              discountAmount: 652.519,
              quantityCap: 999999,
              wasApportioned: false,
              calculationBasis: 'basePrice',
              maxRepetitionAllowed: 9999,
              sequence: 0,
              erpDiscountId: '0000005882',
              orderPosition: 533,
              amountCap: '99999999.000',
              erpDiscountClassId: 'ZA07',
              applyRestriction: false,
              discountType: 'P',
              discountId: 47310,
              portfolioPriceId: 27610667,
              appliedDiscount: {
                calculationType: 'P',
                productGroupDiscountId: 64346,
                value: 0.097,
              },
            },
          ],
          finalTaxes: 1983,
          taxesToApply: [
            0,
            1376.45139,
            607.4481,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 1376.45139,
            },
            IMPG: {
              erpTaxId: 'YIBA-0000862195',
              taxBase: 0,
              calculationBase: 'NETO',
              amount: 0,
              percentage: 0.1,
              value: 607.4481,
            },
          },
        },
        portfolioPriceId: 27610667,
        productGroup: {
          category: 'Bebidas',
          macroCategory: 'Sin macrocategoria',
        },
        productGroupDiscountIdList: [
          64346,
          64346,
        ],
        erpProductId: '000000000000121310',
        orderPosition: 1760,
        totals: {
          finalTaxes: 9919,
          listPrice: 33635,
          shippingPrice: 5850,
          taxes: 10865,
          others: 0,
          discounts: 3263,
          finalPrice: 46141,
        },
      },
      {
        productId: 402,
        deliveryType: 'delivery',
        quantity: 1,
        name: 'Cerv Budweiser Rba LT355cc 5g x12 ABCDEF',
        productGroupName: 'Sin macrocategoria',
        segmentId: 2,
        price: {
          listPrice: 9626,
          finalPrice: 13453,
          taxes: 3806,
          discounts: 0,
          others: 0,
          shippingPrice: 21,
          accumulatedDiscounts: [],
          finalTaxes: 3806,
          taxesToApply: [
            0,
            1832.93,
            1973.33,
            0,
          ],
          taxesApplied: {
            IIVA: {
              erpTaxId: 'MWST-0009549116',
              taxBase: 0,
              calculationBase: 'NFLE',
              amount: 0,
              percentage: 0.19,
              value: 1832.93,
            },
            IMPG: {
              erpTaxId: 'YILV-0000860345',
              taxBase: 0,
              calculationBase: 'NETO',
              amount: 0,
              percentage: 0.205,
              value: 1973.33,
            },
          },
        },
        portfolioPriceId: 27631583,
        productGroup: {
          category: 'Sin categoria',
          macroCategory: 'Sin macrocategoria',
        },
        erpProductId: '000000000000127219',
        orderPosition: 4680,
        totals: {
          finalTaxes: 3806,
          listPrice: 9626,
          shippingPrice: 21,
          taxes: 3806,
          others: 0,
          discounts: 0,
          finalPrice: 13453,
        },
      },
    ];

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      orderId: '10000079',
      clientId: 92,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
      items: redisItems,
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        update: jest.fn().mockResolvedValue({}),
        getByOrderIdAndClientId: jest.fn().mockResolvedValue({ status: 'initiated' }),
      },
      OrderItem: { create: jest.fn().mockResolvedValue({}) },
      CreditLimit: {
        getAvailablesAndSegmentId: jest.fn().mockResolvedValue([
          { available: '945392.000', segmentId: 1 },
          { available: '945392.000', segmentId: 2 },
        ]),
      },
    });

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({ items: redisItems }) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
            { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      order: {
        isValidDataToConfirmOrder: jest.fn(),
        validateExistsResult: jest.fn(),
        validateIfOrderIsConfirmed: jest.fn().mockReturnValue(undefined),
        hasOperationDates: jest.fn(),
      },
    };

    const getTableNames = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME_CALCULATION_RESULT: 'devOrderCalculationSubTotalsBySegment' });

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devOrderCalculationSubTotalsBySegment: { id: '001-CL-3043-10000605-92' },
            devParameters: {
              Item: {
                id: '001-CL-3043-10000605-92',
                accumulatedBySegments: [
                  { segmentId: 1, subTotal: 2484 },
                  { segmentId: 2, subTotal: 10467 },
                ],
              },
            },
          };

          return tableSelected[tablaName];
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };

    const getInstanceQueue = jest.fn().mockResolvedValue({ send: jest.fn().mockResolvedValue() });

    const sendToSQS = jest.fn().mockResolvedValue({
      sqsRes: {
        ResponseMetadata: { RequestId: 'f180f73e-dd41-566d-81cc-ad40ea5e8210' },
        MD5OfMessageBody: '8f9398945a39d41437a5f07b664171bf',
        MessageId: '8f712b29-0219-44c7-96a6-6815b1894a10',
        SequenceNumber: '18867721442745072384',
      },
      message: {
        msgBody: {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 92,
          accumulatedBySegments: [
            { subTotal: 56256, segmentId: 1 },
            { subTotal: 13453, segmentId: 2 },
          ],
        },
        msgGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000370-92',
        msgDedupId: 'abb1b33c-8da5-437f-aecb-9905a4d88c4d',
      },
    });
    const uuid = { v4: jest.fn().mockReturnValue('1715ba2d-5b0b-4ba0-883b-c48a0de8a670') };

    const { confirmOrder } = await handler({ accessControl, repositories, experts, res, dbRedis, getTableNames, awsRepositories, getInstanceQueue, uuid, sendToSQS });

    await confirmOrder(event);

    expect(repositories.mock.calls).toEqual([[]]);

    expect(dbRedis.mock.calls).toEqual([[]]);

    expect(experts.order.isValidDataToConfirmOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: redisItems,
          organizationId: '3043',
          orderId: '10000079',
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Order, OrderItem } = await repositories();

    expect(Order.getByOrderIdAndClientId.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: redisItems,
          organizationId: '3043',
          orderId: '10000079',
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(experts.order.validateIfOrderIsConfirmed.mock.calls).toEqual([
      [
        'initiated',
      ],
    ]);

    const redis = await dbRedis();

    expect(redis.order.get.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          countryId: 'CL',
          cpgId: '001',
          items: redisItems,
          orderId: '10000079',
          clientId: 92,
          organizationId: '3043',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
        '10000079',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([[]]);

    expect(OrderItem.create.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: redisItems,
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(Order.update.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: redisItems,
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        {
          status: 'created',
          orderDeliveryDate: '2021-05-20T00:00:00.000Z',
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          orderId: '10000079',
          itemsCreated: {},
        },
      ],
    ]);

  });

  it('It should return a validation error.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      items: {},
      organizationId: '3043',
      orderId: '10000079',
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        update: jest.fn().mockResolvedValue({}),
        getByOrderIdAndClientId: jest.fn().mockResolvedValue({ status: 'initiated' }),
      },
      OrderItem: { create: jest.fn().mockResolvedValue({}) },
    });

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
            { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      order: {
        isValidDataToConfirmOrder: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'Validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
        validateExistsResult: jest.fn(),
        validateIfOrderIsConfirmed: jest.fn().mockReturnValue(undefined),
        hasOperationDates: jest.fn(),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn(),
    };

    const { confirmOrder } = await handler({ accessControl, repositories, experts, res, dbRedis });

    const result = await confirmOrder(event);

    expect(repositories.mock.calls).toEqual([[]]);

    expect(dbRedis.mock.calls).toEqual([[]]);

    expect(experts.order.isValidDataToConfirmOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: {},
          organizationId: '3043',
          orderId: '10000079',
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const redis = await dbRedis();

    expect(redis.order.get.mock.calls).toEqual([]);

    expect(redis.closeConnection.mock.calls).toEqual([]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([]);

    const { Order, OrderItem } = await repositories();

    expect(OrderItem.create.mock.calls).toEqual([]);

    expect(Order.update.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,
      ],
    ]);

  });

  it('It should return a database error.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      items: {},
      organizationId: '3043',
      orderId: '10000079',
      clientId: 92,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ userName: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670' }),
    };


    const repositories = jest.fn().mockResolvedValue({
      Order: {
        update: jest.fn().mockRejectedValue({}),
        getByOrderIdAndClientId: jest.fn().mockResolvedValue({ status: 'initiated' }),
      },
      OrderItem: { create: jest.fn().mockResolvedValue({}) },
      CreditLimit: { getAvailablesAndSegmentId: jest.fn().mockResolvedValue({}) },
    });

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue({ items: {} }) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
            { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const experts = {
      order: {
        isValidDataToConfirmOrder: jest.fn(),
        validateExistsResult: jest.fn(),
        handlersDatabaseError: jest.fn(() => ({
          customError: true,
          getData: jest.fn().mockReturnValue({
            httpStatus: 400,
            status: 'error',
            code: 500,
            msg: 'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
            type: 'sequelize_error',
            meta: {
              name: 'SequelizeForeignKeyConstraintError',
              description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
              fields: ['productId'],
            },
          }),
        })),
        validateIfOrderIsConfirmed: jest.fn().mockReturnValue(undefined),
        hasOperationDates: jest.fn(),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
      error: jest.fn(),
    };

    const getTableNames = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME_CALCULATION_RESULT: 'devOrderCalculationSubTotalsBySegment' });

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devOrderCalculationSubTotalsBySegment: { id: '001-CL-3043-10000605-92' },
            devParameters: {
              Item: {
                id: '001-CL-3043-10000605-92',
                accumulatedBySegments: [
                  { segmentId: 1, subTotal: 2484 },
                  { segmentId: 2, subTotal: 10467 },
                ],
              },
            },
          };

          return tableSelected[tablaName];
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const getInstanceQueue = jest.fn().mockResolvedValue({ send: jest.fn().mockResolvedValue() });

    const sendToSQS = jest.fn().mockResolvedValue({
      sqsRes: {
        ResponseMetadata: { RequestId: 'f180f73e-dd41-566d-81cc-ad40ea5e8210' },
        MD5OfMessageBody: '8f9398945a39d41437a5f07b664171bf',
        MessageId: '8f712b29-0219-44c7-96a6-6815b1894a10',
        SequenceNumber: '18867721442745072384',
      },
      message: {
        msgBody: {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 92,
          accumulatedBySegments: [
            { subTotal: 56256, segmentId: 1 },
            { subTotal: 13453, segmentId: 2 },
          ],
        },
        msgGroupId: 'confirmOrder.updateCredit-001-CL-3043-10000370-92',
        msgDedupId: 'abb1b33c-8da5-437f-aecb-9905a4d88c4d',
      },
    });

    const uuid = { v4: jest.fn().mockReturnValue('1715ba2d-5b0b-4ba0-883b-c48a0de8a670') };

    const { confirmOrder } = await handler({ accessControl, repositories, experts, res, dbRedis, getTableNames, awsRepositories, getInstanceQueue, uuid, sendToSQS });

    await confirmOrder(event);

    expect(repositories.mock.calls).toEqual([[]]);

    expect(dbRedis.mock.calls).toEqual([[]]);

    expect(experts.order.isValidDataToConfirmOrder.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          items: {},
          organizationId: '3043',
          orderId: '10000079',
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    const { Order, OrderItem } = await repositories();

    expect(Order.getByOrderIdAndClientId.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          countryId: 'CL',
          cpgId: '001',
          items: {},
          orderId: '10000079',
          organizationId: '3043',
          clientId: 92,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
      ],
    ]);

    const redis = await dbRedis();

    expect(redis.order.get.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          countryId: 'CL',
          cpgId: '001',
          items: {},
          orderId: '10000079',
          clientId: 92,
          organizationId: '3043',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
        '10000079',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([[]]);

    expect(experts.order.validateExistsResult.mock.calls).toEqual([
      [
        { status: 'initiated' },
      ],
      [
        {},
      ],
    ]);

    expect(OrderItem.create.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: {},
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);

    expect(Order.update.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          orderId: '10000079',
          items: {},
          clientId: 92,
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        {
          orderDeliveryDate: '2021-05-20T00:00:00.000Z',
          status: 'created',
        },
      ],
    ]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.status().json.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Invalid value in field “productId”. The received value does not meet a foreign key constraint in the database.',
        500,
        'sequelize_error',
        400,
        {
          name: 'SequelizeForeignKeyConstraintError',
          description: 'Cannot add or update a child row: a foreign key constraint fails (`b2b`.`orderItem`, CONSTRAINT `orderItem_prod_FK` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`))',
          fields: ['productId'],
        },
      ],
    ]);

  });
});