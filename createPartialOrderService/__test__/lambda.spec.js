const handlerOrder = require('../lambda');
const { orderMock, eventMock } = require('./__mocks__/Order');

describe('CreateOrder Lambda function', () => {

  it('It should update order in redis and return a httpStatus 201. ', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 124, // Solo se envía si ya existe
      deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
      deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
        },
      ],
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        create: jest.fn().mockResolvedValue({ orderId: 1 }),
        getTaxesData: jest.fn().mockResolvedValue({}),
      },
      PortfolioPrice: { getById: jest.fn().mockResolvedValue({ shippingPrice: 50 }) },
      Discount: {
        getAll: jest.fn().mockResolvedValue({ data: { discounts: [ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ] } }),
        getAllExclusions: jest.fn().mockResolvedValue({ exclusions: [] }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue(true),
        handlersDatabaseError: jest.fn(),
        hasOperationDates: jest.fn(),
        hasDataLoaded: jest.fn(),
      },
    };

    const getTableNames = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME: 'devOrderItemDetail',
      DYNAMODB_TABLE_NAME_PARAMETERS: 'devParameters',
      DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL: 'devDiscountDomainModel',
    });

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devDiscountDomainModel: {
              domainModelId: id,
              cpgId: '001',
              countryId: 'CL',
              organizationId: '3043',
              clientId: 6,
              pricesDate: '2021-09-13',
              discounts: [ {} ],
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

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const dbRedis = jest.fn().mockResolvedValue({
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
        ]),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          pricesDate: '2021-09-02T00:00:00.000Z',
        }),
      },
    });

    const taxCalculator = jest.fn().mockResolvedValue(
      [
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
    );

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
    };

    const strategy = jest.fn().mockReturnValue({
      setOrder: jest.fn().mockResolvedValue({
        orderClient: { orderId: 124 },
        discountList: {},
        exclusionsArray: [],
      }),
    });

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IIVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

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

    const elasticSearchRepositories = jest.fn().mockReturnValue({});
    const Query = jest.fn().mockReturnValue({});
    const connection = jest.fn().mockReturnValue({});
    const elasticPortfolioPrice = jest.fn().mockResolvedValue(
      {
        partialResult:
                    [
                      {
                        _index: 'dev-portfolio-product',
                        _type: '_doc',
                        _id: '001-CL-3043-1-158-98',
                        _score: null,
                        _source: {
                          updatedTime: null,
                          price: {
                            shippingPrice: 814,
                            validityFrom: '2020-11-13T03:00:00.000Z',
                            finalPrice: 8693.18,
                            others: 0,
                            listPrice: 5988,
                            discounts: 0,
                            taxes: 1891.18,
                            validityTo: '2099-12-31T03:00:00.000Z',
                            portfolioPriceId: 98,
                          },
                          locked: false,
                          clientId: 1,
                          returnability: false,
                          productId: 9,
                          orderPosition: 1,
                          updatedBy: null,
                          availability: true,
                          size: '1.5 Lts',
                          organizationId: '3043',
                          unitMeasure: 'PACK',
                          countryId: 'CL',
                          cpgId: '001',
                          deleted: false,
                          flavor: 'Lemon Lime',
                          brand: 'Sprite',
                          createdTime: '2021-02-18T21:58:34.000Z',
                          erpUnitMeasureId: 'PAC',
                          createdBy: 'Interface XTRACT-B2B',
                          erpProductId: '000000000000121520',
                          productGroup: {
                            macroCategory: 'Bebidas sin alcohol',
                            name: 'Bebidas',
                          },
                          package: 'Botella Plástico No Retornable',
                          image: 'products/001_CL_3043_000000000000121520.jpg',
                          name: 'Sprite Lima Limón Botella Plástico No Retornable 1.5L 1X6 und.',
                        },
                        sort: [
                          'Sprite',
                        ],
                      },
                    ],
        portfolioPriceIdList: [ 14, 15 ],
      },
    );

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({
        userName: '3077c231-c352-41eb-8aaf-2457022dae77',
        userPoolId: '391147e2eda',
        createdAndSigned: 'https://cognito.com/0242ac130003',
      }),
    };

    const Cognito = jest.fn().mockReturnValue({
      getUserPoolId: jest.fn().mockReturnValue('0242ac130003'),
      setIdentityConfig: jest.fn(),
    });

    const getSourceChannel = jest.fn();

    const taxesHandler = { taxCalculator: jest.fn().mockResolvedValue({}) };

    const rounding = { order: { applyRounds: jest.fn().mockReturnValue({}) } };

    const elasticMapper = jest.fn().mockResolvedValue(undefined);

    const processOrderStrategy = jest.fn().mockResolvedValue([
      {
        portfolioPriceId: 14,
        productId: 9,
        quantity: 2,
        price: {
          listPrice: 5988,
          finalPrice: 8693.18,
          discounts: 0,
          taxes: 1891.18,
          others: 0,
          shippingPrice: 814,
          accumulatedDiscounts: [],
        },
        taxes: 20,
        others: 0,
        productGroupId: 7,
        productGroup: { category: 'Bebidas', macroCategory: 'Bebidas sin alcohol' },
        name: 'Sprite Lima Limón Botella Plástico No Retornable 1.5L 1X6 und.',
        orderPosition: 1,
        deliveryType: '06',
        productGroupDiscountIdList: undefined,
        erpProductId: '000000000000121520',
      },
    ]);

    const orderDeliveryStrategy = jest.fn().mockResolvedValue([
      {
        deliveryDate: '2022-03-31T21:00:00.000-03:00',
        deliveryType: 'deliveryFrozen',
      },
      {
        deliveryDate: '2022-03-31T21:00:00.000-03:00',
        deliveryType: 'delivery',
      },
    ]);

    const { createPartialOrder } = handlerOrder({ accessControl, repositories, experts, res, dbRedis, taxCalculator, taxType, strategy, builder, discountsHandler, elasticSearchRepositories, Query, connection, elasticPortfolioPrice, awsRepositories, getTableNames, Cognito, getSourceChannel, rounding, taxesHandler, processOrderStrategy, elasticMapper, orderDeliveryStrategy });
    await createPartialOrder(event);

    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        event,
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(redis.clientDataLoaded.get.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(getTableNames.mock.calls).toEqual([ [] ]);
    expect(redis.clientDiscount.get.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(builder.buildRequireParams.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(builder.buildKeyTable).toHaveBeenCalled();
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devParameters',
        {},
      ],
    ]);
    expect(Cognito.mock.calls).toEqual([
      [],
    ]);
    expect(Cognito().getUserPoolId.mock.calls).toEqual([
      [
        'https://cognito.com/0242ac130003',
      ],
    ]);
    expect(Cognito().setIdentityConfig.mock.calls).toEqual([
      [
        '391147e2eda',
        '0242ac130003',
      ],
    ]);
    expect(strategy.mock.calls).toEqual([
      [ 124 ],
    ]);

    const { Order, PortfolioPrice, Discount, closeConnection } = await repositories();
    expect(strategy().setOrder.mock.calls).toEqual([
      [
        {
          event,
          params: {
            cpgId: '001',
            countryId: 'AR',
            organizationId: '3043',
            clientId: 2,
            deliverydate: '2021-01-30T00:00:00',
          },
          experts,
          Order,
          Discount,
          redis,
          cognito: {
            getUserPoolId: Cognito().getUserPoolId,
            setIdentityConfig: Cognito().setIdentityConfig,
          },
          getSourceChannel,
        },
      ],
    ]);
    expect(elasticMapper.mock.calls).toEqual([
      [
        event,
        elasticPortfolioPrice,
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          deliverydate: '2021-01-30T00:00:00',
        },
        connection,
        elasticSearchRepositories,
        Query,
      ],
    ]);
    expect(processOrderStrategy.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          clientId: 2,
          countryId: 'AR',
          cpgId: '001',
          createdBy: undefined,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [
            {
              deliveryType: '06',
              erpProductId: '000000000000121520',
              name: 'Sprite Lima Limón Botella Plástico No Retornable 1.5L 1X6 und.',
              orderPosition: 1,
              others: 0,
              portfolioPriceId: 14,
              price: {
                accumulatedDiscounts: [],
                discounts: 0,
                finalPrice: 8693.18,
                listPrice: 5988,
                others: 0,
                shippingPrice: 814,
                taxes: 1891.18,
              },
              productGroup: {
                category: 'Bebidas',
                macroCategory: 'Bebidas sin alcohol',
              },
              productGroupDiscountIdList: undefined,
              productGroupId: 7,
              productId: 9,
              quantity: 2,
              taxes: 20,
            },
          ],
          orderId: 124,
          organizationId: '3043',
          priceDateByCountry: '2021-09-02T00:00:00.000Z',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
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
        [],
        '2021-09-02T00:00:00.000Z',
        'devDiscountDomainModel',
      ],
    ]);

    expect(Order.getTaxesData.mock.calls).toEqual([
      [
        2,
        '2021-09-02T00:00:00.000Z',
      ],
    ]);

    expect(taxesHandler.taxCalculator.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          clientId: 2,
          countryId: 'AR',
          cpgId: '001',
          createdBy: undefined,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [
            {
              deliveryType: '06',
              erpProductId: '000000000000121520',
              name: 'Sprite Lima Limón Botella Plástico No Retornable 1.5L 1X6 und.',
              orderPosition: 1,
              others: 0,
              portfolioPriceId: 14,
              price: {
                accumulatedDiscounts: [],
                discounts: 0,
                finalPrice: 8693.18,
                listPrice: 5988,
                others: 0,
                shippingPrice: 814,
                taxes: 1891.18,
              },
              productGroup: {
                category: 'Bebidas',
                macroCategory: 'Bebidas sin alcohol',
              },
              productGroupDiscountIdList: undefined,
              productGroupId: 7,
              productId: 9,
              quantity: 2,
              taxes: 20,
            },
          ],
          orderId: 124,
          organizationId: '3043',
          priceDateByCountry: '2021-09-02T00:00:00.000Z',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
        {
          internalTaxes: 'IMPI',
          iva: 'IIVA',
          generalTaxes: 'IMPG',
          percepcion: 'PERC',
        },
        {},
        5988,
      ],
    ]);

    expect(rounding.order.applyRounds.mock.calls).toEqual([
      [
        {},
        '2',
      ],
    ]);

    expect(redis.order.upsert).toHaveBeenCalled();

    expect(redis.closeConnection.mock.calls).toEqual([ [] ]);

    expect(res.status.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(res.status().json).toHaveBeenCalled();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it.skip('It should update the order in redis receiving an empty array and return a calculatedItems with an empty array.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: 124,
      deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
      deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
      items: [],
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        create: jest.fn().mockResolvedValue({ orderId: 1 }),
        getTaxesData: jest.fn().mockResolvedValue({}),
      },
      PortfolioPrice: { getById: jest.fn().mockResolvedValue({ shippingPrice: 50 }) },
      Discount: {
        getAll: jest.fn().mockResolvedValue({ data: { discounts: [ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ] } }),
        getAllExclusions: jest.fn().mockResolvedValue({ exclusions: [] }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue(true),
        handlersDatabaseError: jest.fn(),
        hasOperationDates: jest.fn(),
        hasDataLoaded: jest.fn(),
      },
    };

    const getTableNames = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME: 'devOrderItemDetail',
      DYNAMODB_TABLE_NAME_PARAMETERS: 'devParameters',
      DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL: 'devDiscountDomainModel',
    });

    const awsRepositories = {
      Repository: {
        get: jest.fn((tablaName, id) => {
          const tableSelected = {
            devDiscountDomainModel: {
              domainModelId: id,
              cpgId: '001',
              countryId: 'CL',
              organizationId: '3043',
              clientId: 6,
              pricesDate: '2021-09-13',
              discounts: [ {} ],
            },
            devParameters: {
              Item: {
                Item: {
                  statusArray: [
                    {},
                  ],
                  transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
                },
              },
            },
          };

          return tableSelected[tablaName];
        }),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ]),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
        }),
      },
    });

    const taxCalculator = jest.fn().mockResolvedValue(
      [
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
    );

    const builder = {
      buildRequireParams: jest.fn().mockReturnValue({
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: 2,
        deliverydate: '2021-01-30T00:00:00',
      }),
      buildKeyTable: jest.fn().mockReturnValue({}),
    };

    const strategy = jest.fn().mockReturnValue({
      setOrder: jest.fn().mockResolvedValue({
        orderClient: { orderId: 124 },
        discountList: {},
        exclusionsArray: [],
      }),
    });

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IIVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

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

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({
        userName: '3077c231-c352-41eb-8aaf-2457022dae77',
        userPoolId: '391147e2eda',
        createdAndSigned: 'https://cognito.com/0242ac130003',
      }),
    };

    const Cognito = jest.fn().mockReturnValue({
      getUserPoolId: jest.fn().mockReturnValue('0242ac130003'),
      setIdentityConfig: jest.fn(),
    });

    const getSourceChannel = jest.fn();

    const taxesHandler = { taxCalculator: jest.fn().mockResolvedValue({}) };

    const rounding = { order: { applyRounds: jest.fn().mockReturnValue({}) } };

    const processOrderStrategy = jest.fn().mockResolvedValue([
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

    const { createPartialOrder } = handlerOrder({ accessControl, repositories, experts, res, dbRedis, taxCalculator, taxType, strategy, builder, discountsHandler, awsRepositories, getTableNames, Cognito, getSourceChannel, rounding, taxesHandler, processOrderStrategy });
    await createPartialOrder(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [],
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(redis.clientDataLoaded.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [],
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(getTableNames.mock.calls).toEqual([ [] ]);
    expect(redis.clientDiscount.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: 124,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [],
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
        },
      ],
    ]);
    expect(builder.buildRequireParams.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(builder.buildKeyTable.mock.calls).toEqual([
      [
        {
          b2bSession: { Authorization: 'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.' },
          clientId: 2,
          countryId: 'AR',
          cpgId: '001',
          createdBy: undefined,
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
          items: [],
          orderDeliveryDate: undefined,
          orderId: 124,
          organizationId: '3043',
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        },
      ],
    ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devParameters',
        {},
      ],
    ]);
    expect(Cognito.mock.calls).toEqual([
      [],
    ]);
    expect(Cognito().getUserPoolId.mock.calls).toEqual([
      [
        'https://cognito.com/0242ac130003',
      ],
    ]);
    expect(Cognito().setIdentityConfig.mock.calls).toEqual([
      [
        '391147e2eda',
        '0242ac130003',
      ],
    ]);

    expect(strategy.mock.calls).toEqual([
      [ 124 ],
    ]);

    const { Order, PortfolioPrice, Discount, closeConnection } = await repositories();
    expect(strategy().setOrder.mock.calls).toEqual([
      [
        {
          event,
          params: {
            cpgId: '001',
            countryId: 'AR',
            organizationId: '3043',
            clientId: 2,
            deliverydate: '2021-01-30T00:00:00',
          },
          experts,
          Order,
          Discount,
          redis,
          cognito: {
            getUserPoolId: Cognito().getUserPoolId,
            setIdentityConfig: Cognito().setIdentityConfig,
          },
          getSourceChannel,
        },
      ],
    ]);

    expect(processOrderStrategy.mock.calls).toEqual([]);

    expect(Order.getTaxesData.mock.calls).toEqual([]);

    expect(taxesHandler.taxCalculator.mock.calls).toEqual([]);

    expect(rounding.order.applyRounds.mock.calls).toEqual([]);

    expect(redis.closeConnection.mock.calls).toEqual([]);

    expect(redis.order.upsert.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(res.status().json.mock.calls).toEqual([
      [
        {
          orderId: 124,
          calculatedItems: [],
        },
      ],
    ]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('it should throw a validation error.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '',
      deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
      deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        create: jest.fn().mockResolvedValue({ orderId: 1 }),
        getTaxesData: jest.fn().mockResolvedValue({}),
      },
      PortfolioPrice: { getById: jest.fn().mockResolvedValue({ shippingPrice: 50 }) },
      Discount: {
        getAll: jest.fn().mockResolvedValue({ data: { discounts: [ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ] } }),
        getAllExclusions: jest.fn().mockResolvedValue({ exclusions: [] }),
      },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'validation_error',
              code: 50,
              type: 'validation_error',
              httpStatus: 400,
            }),
          };
        }),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue(true),
        handlersDatabaseError: jest.fn(),
        hasOperationDates: jest.fn(),
        hasDataLoaded: jest.fn(),
      },
    };

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
    };

    const getTableNames = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME: 'devOrderItemDetail',
      DYNAMODB_TABLE_NAME_PARAMETERS: 'devParameters',
      DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL: 'devDiscountDomainModel',
    });

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          },
        }),
      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ]),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
        }),
      },
    });

    const taxCalculator = jest.fn().mockResolvedValue(
      [
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
    );

    const builder = {
      buildRequireParams: jest.fn().mockReturnValue({
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        clientId: 2,
        deliverydate: '2021-01-30T00:00:00',
      }),
      buildKeyTable: jest.fn().mockReturnValue({}),
    };

    const strategy = jest.fn().mockReturnValue({
      setOrder: jest.fn().mockResolvedValue({
        orderClient: { orderId: 321 },
        discountList: {},
        exclusionsArray: [],
      }),
    });

    const taxType = jest.fn().mockReturnValue({
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    });

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({
        userName: '3077c231-c352-41eb-8aaf-2457022dae77',
        userPoolId: '391147e2eda',
        createdAndSigned: 'https://cognito.com/0242ac130003',
      }),
    };

    const Cognito = jest.fn().mockReturnValue({
      getUserPoolId: jest.fn().mockReturnValue('0242ac130003'),
      setIdentityConfig: jest.fn(),
    });

    const getSourceChannel = jest.fn();

    const taxesHandler = { taxCalculator: jest.fn().mockResolvedValue({}) };

    const rounding = { order: { applyRounds: jest.fn().mockReturnValue({}) } };

    const processOrderStrategy = jest.fn().mockResolvedValue([
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

    const { createPartialOrder } = handlerOrder({ accessControl, repositories, experts, res, dbRedis, taxCalculator, taxType, builder, discountsHandler, strategy, awsRepositories, getTableNames, Cognito, getSourceChannel, rounding, taxesHandler, processOrderStrategy });
    await createPartialOrder(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);

    expect(dbRedis.mock.calls).toEqual([]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([]);
    expect(redis.clientDataLoaded.get.mock.calls).toEqual([]);
    expect(getTableNames.mock.calls).toEqual([]);
    expect(redis.clientDiscount.getByDeliveryDate.mock.calls).toEqual([]);
    expect(discountsHandler.processDiscounts.mock.calls).toEqual([]);

    expect(builder.buildRequireParams.mock.calls).toEqual([]);
    expect(builder.buildKeyTable.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([]);
    expect(Cognito.mock.calls).toEqual([]);
    expect(Cognito().getUserPoolId.mock.calls).toEqual([]);
    expect(Cognito().setIdentityConfig.mock.calls).toEqual([]);
    expect(strategy.mock.calls).toEqual([]);
    expect(processOrderStrategy.mock.calls).toEqual([]);
    const { Order } = await repositories();
    expect(Order.getTaxesData.mock.calls).toEqual([]);
    expect(taxesHandler.taxCalculator.mock.calls).toEqual([]);
    expect(rounding.order.applyRounds.mock.calls).toEqual([]);
    expect(redis.order.upsert.mock.calls).toEqual([]);
    expect(redis.closeConnection.mock.calls).toEqual([]);
    expect(res.status.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_error',
        50,
        'validation_error',
        400,
      ],
    ]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('it should throw a 409 Conflict error when is not present "clientDataLoaded" into Redis.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '',
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

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        create: jest.fn().mockRejectedValue({}),
        getTaxesData: jest.fn().mockRejectedValue({}),
      },
      PortfolioPrice: { getById: jest.fn().mockResolvedValue({ shippingPrice: 50 }) },
      Discount: {
        getAll: jest.fn().mockResolvedValue({ data: { discounts: [ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ] } }),
        getAllExclusions: jest.fn().mockResolvedValue({ exclusions: [] }),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue(true),
        handlersDatabaseError: jest.fn().mockReturnValue(
          {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'sequelize_error',
              code: 50,
              type: 'sequelize_error',
              httpStatus: 500,
              meta: {},
            }),
          },
        ),
        hasOperationDates: jest.fn(),
        hasDataLoaded: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'Discounts expired. Initialize the chart',
              code: 41,
              type: 'order_error',
              httpStatus: 409,
              meta: {},
            }),
          };
        }),
      },
    };

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
    };

    const getTableNames = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME: 'devOrderItemDetail',
      DYNAMODB_TABLE_NAME_PARAMETERS: 'devParameters',
    });
    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          },
        }),
        create: jest.fn().mockResolvedValue({}),

      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ]),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: '2021-01-14',
          pricesDate: '2021-09-02T00:00:00.000Z',
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
    };

    const strategy = jest.fn().mockReturnValue({ setOrder: jest.fn().mockRejectedValue({}) });

    const taxCalculator = jest.fn().mockResolvedValue(
      [
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
    );

    const taxType = jest.fn().mockReturnValue({
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    });

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({
        userName: '3077c231-c352-41eb-8aaf-2457022dae77',
        userPoolId: '391147e2eda',
        createdAndSigned: 'https://cognito.com/0242ac130003',
      }),
    };

    const Cognito = jest.fn().mockReturnValue({
      getUserPoolId: jest.fn().mockReturnValue('0242ac130003'),
      setIdentityConfig: jest.fn(),
    });

    const getSourceChannel = jest.fn();

    const taxesHandler = { taxCalculator: jest.fn().mockResolvedValue({}) };

    const rounding = { order: { applyRounds: jest.fn().mockReturnValue({}) } };

    const { createPartialOrder } = handlerOrder({ accessControl, repositories, experts, res, dbRedis, taxCalculator, taxType, builder, discountsHandler, strategy, awsRepositories, getTableNames, Cognito, getSourceChannel, rounding, taxesHandler });
    await createPartialOrder(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
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
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);

    expect(redis.clientDataLoaded.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
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
      ],
    ]);

    expect(experts.order.hasDataLoaded.mock.calls).toEqual([
      [ {} ],
    ]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Discounts expired. Initialize the chart',
        41,
        'order_error',
        409,
      ],
    ]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);


  });

  it('it should throw a sequelize error.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '',
      deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
      deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        create: jest.fn().mockRejectedValue({}),
        getTaxesData: jest.fn().mockRejectedValue({}),
      },
      PortfolioPrice: { getById: jest.fn().mockResolvedValue({ shippingPrice: 50 }) },
      Discount: {
        getAll: jest.fn().mockResolvedValue({ data: { discounts: [ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ] } }),
        getAllExclusions: jest.fn().mockResolvedValue({ exclusions: [] }),
      },
      clientDataLoaded: { get: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      order: {
        isValidRequiredData: jest.fn(),
        isValidDate: jest.fn(),
        formatDate: jest.fn().mockReturnValue(true),
        handlersDatabaseError: jest.fn().mockReturnValue(
          {
            customError: true,
            getData: jest.fn().mockReturnValue({
              msg: 'sequelize_error',
              code: 50,
              type: 'sequelize_error',
              httpStatus: 500,
              meta: {},
            }),
          },
        ),
        hasOperationDates: jest.fn(),
        hasDataLoaded: jest.fn(),
      },
    };

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
    };

    const getTableNames = jest.fn().mockResolvedValue({
      DYNAMODB_TABLE_NAME: 'devOrderItemDetail',
      DYNAMODB_TABLE_NAME_PARAMETERS: 'devParameters',
      DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL: 'devDiscountDomainModel',
    });
    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            statusArray: [
              {},
            ],
            transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          },
        }),
        create: jest.fn().mockResolvedValue({}),

      },
    };

    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const dbRedis = jest.fn().mockResolvedValue({
      order: { upsert: jest.fn().mockResolvedValue({}) },
      clientDiscount: {
        upsert: jest.fn().mockResolvedValue({}),
        getByDeliveryDate: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([ { discountId: 4, discountType: 'S', calculationType: 'P', image: 'discounts/001_AR_3043_test-03.jpg', name: 'Escala', maxRepetitionAllowed: 3, allowUserSelection: true, requirements: { scales: [ { min: 1, max: 10, reward: { value: 0.12 } }, { min: 11, max: 20, reward: { value: 0.15 } } ], productId: 10, name: 'Coca Cola Retornable 2.25 L', price: { listPrice: 200 } } } ]),
      },
      closeConnection: jest.fn(),
      discountExclusions: {
        upsert: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue([]),
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
      operationDates: {
        get: jest.fn().mockResolvedValue({
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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
    };

    const strategy = jest.fn().mockReturnValue({ setOrder: jest.fn().mockRejectedValue({}) });

    const taxCalculator = jest.fn().mockResolvedValue(
      [
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
    );

    const taxType = jest.fn().mockReturnValue({
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    });

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({
        userName: '3077c231-c352-41eb-8aaf-2457022dae77',
        userPoolId: '391147e2eda',
        createdAndSigned: 'https://cognito.com/0242ac130003',
      }),
    };

    const Cognito = jest.fn().mockReturnValue({
      getUserPoolId: jest.fn().mockReturnValue('0242ac130003'),
      setIdentityConfig: jest.fn(),
    });

    const getSourceChannel = jest.fn();

    const taxesHandler = { taxCalculator: jest.fn().mockResolvedValue({}) };

    const rounding = { order: { applyRounds: jest.fn().mockReturnValue({}) } };

    const processOrderStrategy = jest.fn().mockResolvedValue([
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

    const { createPartialOrder } = handlerOrder({ accessControl, repositories, experts, res, dbRedis, taxCalculator, taxType, builder, discountsHandler, strategy, awsRepositories, getTableNames, Cognito, getSourceChannel, rounding, taxesHandler, processOrderStrategy });
    await createPartialOrder(event);

    expect(accessControl.getAuthorization.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
        2,
      ],
    ]);
    expect(accessControl.getSessionData.mock.calls).toEqual([
      [
        'Bearer eyJraWQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ.',
      ],
    ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(experts.order.isValidRequiredData.mock.calls).toEqual([
      [
        event,
      ],
    ]);
    expect(dbRedis.mock.calls).toEqual([
      [],
    ]);
    const redis = await dbRedis();
    expect(redis.operationDates.get.mock.calls).toEqual([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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
        '3077c231-c352-41eb-8aaf-2457022dae77',
      ],
    ]);
    expect(redis.clientDataLoaded.get.mock.calls).toEqual([
      [
        {
          createdBy: undefined,
          priceDateByCountry: undefined,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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
      ],
    ]);
    expect(getTableNames.mock.calls).toEqual([ [] ]);
    expect(redis.clientDiscount.get.mock.calls).toEqual([
      [
        {
          createdBy: undefined,
          priceDateByCountry: undefined,
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          clientId: 2,
          orderId: '',
          deliverydate: { visitDate: '2021-01-21T00:00:00.000Z' },
          deliveryfrozen: { visitDate: '2021-01-21T00:00:00.000Z' },
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
      ],
    ]);

    expect(redis.order.upsert.mock.calls).toEqual([]);

    expect(redis.closeConnection.mock.calls).toEqual([]);

    expect(res.status.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'sequelize_error',
        50,
        'sequelize_error',
        500,
        {},
      ],
    ]);
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});