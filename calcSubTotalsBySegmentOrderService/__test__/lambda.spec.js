const handler = require('../lambda');

describe('Initial User Validations', () => {
  it('You should calcualte subTotals and divide it by segments from order', async () => {

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
        getAvailablesBySegmentIdAndName: jest.fn().mockResolvedValue([
          { available: '945392.000', segmentId: 1, Segment: { name: 'NART ' } },
          { available: '945392.000', segmentId: 2, Segment: { name: 'ALCOHOLES' } },
        ]),
      },
    });

    const dbRedis = jest.fn().mockResolvedValue({
      order: { get: jest.fn().mockResolvedValue(redisItems) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          pricesDate: '2021-04-27T18:51:27.926-03:00',
          deliverydate:
            { visitDate: '2021-05-20T00:00:00.000Z', visitPlanId: 90023 },
        }),
      },
      closeConnection: jest.fn(),
    });

    const experts = { order: { validateExistsResult: jest.fn() } };

    const getSubTotalBySegments = jest.fn().mockResolvedValue(
      [
        { segmentId: 1, subTotal: 56256 },
        { segmentId: 2, subTotal: 13453 },
      ],
    );

    const getTableNames = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME_CALCULATION_RESULT: 'devOrderCalculationSubTotalsBySegment' });

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const creditCalculation = jest.fn().mockResolvedValue(
      [
        {
          available: 10945392,
          segmentId: 1,
          segmentName: 'NART ',
          newAvailable: 10889136,
          status: 'OK',
        },
        { checkNonExistantCredit: [ { segmentId: 2, subTotal: 13453 } ] },
      ],
    );

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };

    const { calcSubTotalsBySegmentOrder } = await handler({ accessControl, repositories, experts, res, dbRedis, awsRepositories, getTableNames, getSubTotalBySegments, creditCalculation });

    await calcSubTotalsBySegmentOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(dbRedis.mock.calls).toEqual([ [] ]);

    const { CreditLimit } = await repositories();

    expect(CreditLimit.getAvailablesBySegmentIdAndName.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'CL',
          organizationId: '3043',
          clientId: 92,
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
          items: redisItems,
          orderId: '10000079',
          clientId: 92,
          organizationId: '3043',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
        '10000079',
      ],
    ]);

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(creditCalculation.mock.calls).toEqual([
      [
        [
          {
            Segment: { name: 'NART ' },
            available: '945392.000',
            segmentId: 1,
          },
          {
            Segment: { name: 'ALCOHOLES' },
            available: '945392.000',
            segmentId: 2,
          },
        ],
        [
          {
            segmentId: 1,
            subTotal: 56256,
          },
          {
            segmentId: 2,
            subTotal: 13453,
          },
        ],
      ],
    ]);

    expect(res.status.mock.calls).toEqual([
      [
        200,
      ],
    ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          paymentHandlerResult: [
            {
              available: 10945392,
              segmentId: 1,
              segmentName: 'NART ',
              newAvailable: 10889136,
              status: 'OK',
            },
            { checkNonExistantCredit: [ { segmentId: 2, subTotal: 13453 } ] },
          ],
        },
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
      CreditLimit: { getAvailablesBySegmentIdAndName: jest.fn().mockResolvedValue({}) },
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
        isValidDataTocalcSubTotalsBySegmentOrder: jest.fn(),
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
              fields: [ 'productId' ],
            },
          }),
        })),
        validateIfOrderIsConfirmed: jest.fn().mockReturnValue(undefined),
        hasOperationDates: jest.fn(),
      },
    };

    const res = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };

    const getTableNames = jest.fn().mockResolvedValue({ DYNAMODB_TABLE_NAME_CALCULATION_RESULT: 'devOrderCalculationSubTotalsBySegment' });

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const getSubTotalBySegments = jest.fn().mockResolvedValue(
      [
        { segmentId: 1, subTotal: 56256 },
        { segmentId: 2, subTotal: 13453 },
      ],
    );

    const creditCalculation = jest.fn().mockResolvedValue(
      [
        {
          available: 10945392,
          segmentId: 1,
          segmentName: 'NART ',
          newAvailable: 10889136,
          status: 'FAIL',
        },
        { checkNonExistantCredit: [ { segmentId: 2, subTotal: 13453 } ] },
      ],
    );

    const { calcSubTotalsBySegmentOrder } = await handler({ accessControl, repositories, experts, res, dbRedis, awsRepositories, getTableNames, getSubTotalBySegments, creditCalculation });

    await calcSubTotalsBySegmentOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);

    expect(dbRedis.mock.calls).toEqual([ [] ]);

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

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(res.status().json.mock.calls).toEqual([
      [ {
        paymentHandlerResult: [
          {
            available: 10945392,
            segmentId: 1,
            segmentName: 'NART ',
            newAvailable: 10889136,
            status: 'FAIL',
          },
          { checkNonExistantCredit: [ { segmentId: 2, subTotal: 13453 } ] },
        ],
      },
      ],
    ]);

  });
});