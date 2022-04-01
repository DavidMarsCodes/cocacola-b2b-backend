const handler = require('../../services/transactions');

describe('Transactions Function', () => {

  it('Deberia ejecutar el metodo save.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 1795,
        requireErpConvertion: false,
        createdBy: 'B2B',
        orderDelivery: [
          { deliveryType: 'delivery', deliveryDate: '2021-10-05' },
          { deliveryType: 'deliveryfrozen', deliveryDate: '2021-10-05' },
        ],
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '1795',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '1795',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '1795',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 1795,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '1795',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '1795',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
      bomMap: jest.fn(),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockResolvedValue(true) };
    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };
    const OrderLog = {};

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn() };

    const orderItemDetailTable = 'devOrderItemDetail';

    const { transactions } = handler({ awsRepositories, lodash, Mapper, log, orderItemDetailTable, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devOrderItemDetail',
        { orderId: '1795' },
      ],
    ]);

    expect(lodash.isEmpty.mock.calls).toEqual([
      [
        {
          Item: {
            calculatedItems: [
              {
                erpProductId: '000000000000121545',
                name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
                portfolioPriceId: 221,
                price: {
                  accumulatedDiscounts: [
                    {
                      type: 'A',
                      value: 10,
                    },
                  ],
                  defaultDiscount: 10,
                  discounts: 0,
                  discountsApplied: [
                    {
                      appliedDiscount: {
                        calculationType: 'P',
                        productGroupDiscountId: 6278,
                        value: 0.136,
                      },
                      applyRestriction: false,
                      discountAmount: 293.624,
                      discountId: 926,
                      discountType: 'S',
                      erpDiscountClassId: 'ZB06',
                      erpDiscountId: '0000005838',
                      maxRepetitionAllowed: 0,
                      originalDiscount: {
                        calculationType: 'P',
                        productGroupDiscountId: 6278,
                        value: 0.136,
                      },
                      portfolioPriceId: 3580894,
                      wasApportioned: false,
                    },
                    {
                      appliedDiscount: {
                        calculationType: 'A',
                        productGroupDiscountId: 6278,
                        value: 10,
                      },
                      applyRestriction: false,
                      discountAmount: 10,
                      discountId: 1114,
                      discountType: 'A',
                      erpDiscountClassId: 'ZC06',
                      erpDiscountId: '0000029539',
                      maxRepetitionAllowed: 0,
                      originalDiscount: {
                        calculationType: 'A',
                        productGroupDiscountId: 6278,
                        value: 10,
                      },
                      portfolioPriceId: 3580893,
                      wasApportioned: false,
                    },
                  ],
                  discountsToApply: [
                    10,
                  ],
                  finalPrice: 2334,
                  finalTaxes: 0,
                  listPrice: 2159,
                  others: 0,
                  shippingPrice: 175,
                  taxes: 659,
                  taxesApplied: {
                    IIVA: {
                      amount: 0,
                      calculationBase: 'NFLE',
                      erpTaxId: 'MWST',
                      percentage: 0.19,
                      taxBase: 0,
                      value: 385.77144,
                    },
                    IMPG: {
                      amount: 0,
                      calculationBase: 'NETO',
                      erpTaxId: 'YIBA',
                      percentage: 0.1,
                      taxBase: 0,
                      value: 185.5376,
                    },
                  },
                  taxesToApply: [
                    0,
                    385.77144,
                    185.5376,
                  ],
                },
                productGroupDiscountIdList: [
                  6278,
                ],
                productGroupName: 'Bebidas sin alcohol',
                productId: 174,
                quantity: 9,
                totals: {
                  discounts: 2733,
                  finalPrice: 23415,
                  finalTaxes: 5142,
                  listPrice: 19431,
                  others: 0,
                  shippingPrice: 1575,
                  taxes: 5931,
                },
              },
            ],
            orderId: '1795',
          },
        },
      ],
    ]);

    expect(Mapper.discountMap.mock.calls).toEqual([
      [
        1795,

        {
          calculatedItems: [
            {
              erpProductId: '000000000000121545',
              name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
              portfolioPriceId: 221,
              price: {
                accumulatedDiscounts: [
                  {
                    type: 'A',
                    value: 10,
                  },
                ],
                defaultDiscount: 10,
                discounts: 0,
                discountsApplied: [
                  {
                    appliedDiscount: {
                      calculationType: 'P',
                      productGroupDiscountId: 6278,
                      value: 0.136,
                    },
                    applyRestriction: false,
                    discountAmount: 293.624,
                    discountId: 926,
                    discountType: 'S',
                    erpDiscountClassId: 'ZB06',
                    erpDiscountId: '0000005838',
                    maxRepetitionAllowed: 0,
                    originalDiscount: {
                      calculationType: 'P',
                      productGroupDiscountId: 6278,
                      value: 0.136,
                    },
                    portfolioPriceId: 3580894,
                    wasApportioned: false,
                  },
                  {
                    appliedDiscount: {
                      calculationType: 'A',
                      productGroupDiscountId: 6278,
                      value: 10,
                    },
                    applyRestriction: false,
                    discountAmount: 10,
                    discountId: 1114,
                    discountType: 'A',
                    erpDiscountClassId: 'ZC06',
                    erpDiscountId: '0000029539',
                    maxRepetitionAllowed: 0,
                    originalDiscount: {
                      calculationType: 'A',
                      productGroupDiscountId: 6278,
                      value: 10,
                    },
                    portfolioPriceId: 3580893,
                    wasApportioned: false,
                  },
                ],
                discountsToApply: [
                  10,
                ],
                finalPrice: 2334,
                finalTaxes: 0,
                listPrice: 2159,
                others: 0,
                shippingPrice: 175,
                taxes: 659,
                taxesApplied: {
                  IIVA: {
                    amount: 0,
                    calculationBase: 'NFLE',
                    erpTaxId: 'MWST',
                    percentage: 0.19,
                    taxBase: 0,
                    value: 385.77144,
                  },
                  IMPG: {
                    amount: 0,
                    calculationBase: 'NETO',
                    erpTaxId: 'YIBA',
                    percentage: 0.1,
                    taxBase: 0,
                    value: 185.5376,
                  },
                },
                taxesToApply: [
                  0,
                  385.77144,
                  185.5376,
                ],
              },
              productGroupDiscountIdList: [
                6278,
              ],
              productGroupName: 'Bebidas sin alcohol',
              productId: 174,
              quantity: 9,
              totals: {
                discounts: 2733,
                finalPrice: 23415,
                finalTaxes: 5142,
                listPrice: 19431,
                others: 0,
                shippingPrice: 1575,
                taxes: 5931,
              },
            },
          ],
          orderId: '1795',
        },
      ],
    ]);

    expect(Mapper.orderItemMap.mock.calls).toEqual([
      [
        [
          {
            erpProductId: '120111',
            quantity: 10,
          },
        ],
      ],
    ]);

    expect(Mapper.orderDeliveryMap.mock.calls).toEqual([
      [
        [
          { deliveryType: 'delivery', deliveryDate: '2021-10-05' },
          { deliveryType: 'deliveryfrozen', deliveryDate: '2021-10-05' },
        ],
      ],
    ]);

    expect(Mapper.orderMap.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 1795,
          requireErpConvertion: false,
          createdBy: 'B2B',
          orderDelivery: [
            { deliveryType: 'delivery', deliveryDate: '2021-10-05' },
            { deliveryType: 'deliveryfrozen', deliveryDate: '2021-10-05' },
          ],
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
        [
          {
            erpProductId: '120111',
            quantity: 10,
          },
        ],
        [
          [
            {
              orderId: '1795',
              erpProductId: '000000000000121545',
              erpDiscountClassId: 'ZB06',
              erpDiscountId: '0000005838',
              discountType: 'S',
              discountValue: 293.624,
            },
            {
              orderId: '1795',
              erpProductId: '000000000000121545',
              erpDiscountClassId: 'ZC06',
              erpDiscountId: '0000029539',
              discountType: 'A',
              discountValue: 10,
            },
          ],
        ],
        [
          {
            deliveryType: 'delivery',
            deliveryDate: '2021-10-05',
          },
          {
            deliveryType: 'deliveryfrozen',
            deliveryDate: '2021-10-05',
          },
        ],
      ],
    ]);

    expect(erpManager.save.mock.calls).toEqual([
      [
        {
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 1795,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
          discounts: [
            {
              orderId: '1795',
              erpProductId: '000000000000121545',
              erpDiscountClassId: 'ZB06',
              erpDiscountId: '0000005838',
              discountType: 'S',
              discountValue: 293.624,
            },
            {
              orderId: '1795',
              erpProductId: '000000000000121545',
              erpDiscountClassId: 'ZC06',
              erpDiscountId: '0000029539',
              discountType: 'A',
              discountValue: 10,
            },
          ],
        },
      ],
    ]);

  });

  it('Deberia actualizar el estado de la orden a delivered.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
      bomMap: jest.fn(),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockResolvedValue(true) };

    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };

    const OrderLog = {};

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn().mockReturnValue(true) };

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, Mapper, log, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(Order.updateStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
        'DELIVERED',
      ],
    ]);

  });

  it('Deberia crear un log de auditoria en caso de que todo salga bien con el status OK.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
      bomMap: jest.fn(),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockResolvedValue(true) };
    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };
    const OrderLog = {};

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn() };

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, log, Mapper, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(log.create.mock.calls).toEqual([
      [
        OrderLog,
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
        'OK',
      ],
    ]);

  });

  it('You should run the handler method to handle an error.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 16,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
      bomMap: jest.fn(),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn() };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockRejectedValue({}) };
    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };
    const OrderLog = {};

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, log, Mapper, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(errEvent.handler.mock.calls).toEqual([
      [
        {},
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
      ],
    ]);

  });

  it('You should update the order status to failed.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 16,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockRejectedValue({}) };

    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };

    const OrderLog = {};

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn() };

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, Mapper, log, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(Order.updateStatus.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
        'FAILED',
      ],
    ]);

  });

  it('You should create an audit log in case of error.', async () => {
    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'S',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000005838',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([ {
        erpProductId: '120111',
        quantity: 10,
      } ]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 16,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ {
          erpProductId: '120111',
          quantity: 10,
        } ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      log: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockReturnValue({}) };

    const erpManager = { save: jest.fn().mockRejectedValue({}) };
    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };
    const OrderLog = {};

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn() };

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, Mapper, log, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);


    expect(log.create.mock.calls).toEqual([
      [
        {},
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ {
            erpProductId: '120111',
            quantity: 10,
          } ],
        },
        'ERROR',
        {},
      ],
    ]);

  });

  it('Deberia transformar una promoción BOM a un material.', async () => {

    const orders = [
      {
        cpgId: '001',
        countryId: 'AR',
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [ 
          {
            erpProductId: '121545',
            productId: 1,
            quantity: 9,
          },
          {
            erpProductId: '121500',
            productId: 2,
            quantity: 9,
          },
          {
            erpProductId: '801010',
            quantity: 1,
          },
        ],
      },
    ];

    const orderItemDetail = {
      Item: {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'B',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000801010',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                  quantityApplied: 1,
                  requirements: [
                    {
                      productId: 1,
                      quantity: 1
                    },
                    {
                      productId: 2,
                      quantity: 1
                    }
                  ]
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 10,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
          {
            erpProductId: '000000000000121500',
            name: 'Coca Cola Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
            price: {
              accumulatedDiscounts: [
                {
                  type: 'A',
                  value: 10,
                },
              ],
              defaultDiscount: 10,
              discounts: 0,
              discountsApplied: [
                {
                  appliedDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  applyRestriction: false,
                  discountAmount: 293.624,
                  discountId: 926,
                  discountType: 'B',
                  erpDiscountClassId: 'ZB06',
                  erpDiscountId: '0000801010',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'P',
                    productGroupDiscountId: 6278,
                    value: 0.136,
                  },
                  portfolioPriceId: 3580894,
                  wasApportioned: false,
                  quantityApplied: 1,
                  requirements: [
                    {
                      productId: 1,
                      quantity: 1
                    },
                    {
                      productId: 2,
                      quantity: 1
                    }
                  ]
                },
                {
                  appliedDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  applyRestriction: false,
                  discountAmount: 10,
                  discountId: 1114,
                  discountType: 'A',
                  erpDiscountClassId: 'ZC06',
                  erpDiscountId: '0000029539',
                  maxRepetitionAllowed: 0,
                  originalDiscount: {
                    calculationType: 'A',
                    productGroupDiscountId: 6278,
                    value: 10,
                  },
                  portfolioPriceId: 3580893,
                  wasApportioned: false,
                },
              ],
              discountsToApply: [
                10,
              ],
              finalPrice: 2334,
              finalTaxes: 0,
              listPrice: 2159,
              others: 0,
              shippingPrice: 175,
              taxes: 659,
              taxesApplied: {
                IIVA: {
                  amount: 0,
                  calculationBase: 'NFLE',
                  erpTaxId: 'MWST',
                  percentage: 0.19,
                  taxBase: 0,
                  value: 385.77144,
                },
                IMPG: {
                  amount: 0,
                  calculationBase: 'NETO',
                  erpTaxId: 'YIBA',
                  percentage: 0.1,
                  taxBase: 0,
                  value: 185.5376,
                },
              },
              taxesToApply: [
                0,
                385.77144,
                185.5376,
              ],
            },
            productGroupDiscountIdList: [
              6278,
            ],
            productGroupName: 'Bebidas sin alcohol',
            productId: 174,
            quantity: 9,
            totals: {
              discounts: 2733,
              finalPrice: 23415,
              finalTaxes: 5142,
              listPrice: 19431,
              others: 0,
              shippingPrice: 1575,
              taxes: 5931,
            },
          },
        ],
        orderId: '600',
      },
    };

    const Mapper = {
      discountMap: jest.fn().mockReturnValue([
        [
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000005838',
            discountType: 'S',
            discountValue: 293.624,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      ]),
      orderItemMap: jest.fn().mockReturnValue([  {
        erpProductId: '121545',
        quantity: 9,
      },
      {
        erpProductId: '121500',
        quantity: 9,
      },
      {
        erpProductId: '801010',
        quantity: 1,
      },]),
      orderMap: jest.fn().mockReturnValue({
        organizationId: '3043',
        erpClientId: '0500265522',
        orderDatetime: '2020-12-16T17:34:27z',
        orderDeliveryDate: '20200104',
        orderId: 600,
        requireErpConvertion: false,
        createdBy: 'B2B',
        items: [  {
          erpProductId: '121545',
          quantity: 9,
        },
        {
          erpProductId: '121500',
          quantity: 9,
        },
        {
          erpProductId: '801010',
          quantity: 1,
        }, ],
        discounts: [
          {
            orderId: '600',
            erpProductId: '000000000000121500',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
          {
            orderId: '600',
            erpProductId: '000000000000121545',
            erpDiscountClassId: 'ZC06',
            erpDiscountId: '0000029539',
            discountType: 'A',
            discountValue: 10,
          },
        ],
      }),
      orderDeliveryMap: jest.fn().mockReturnValue([
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-10-05',
        },
        {
          deliveryType: 'deliveryfrozen',
          deliveryDate: '2021-10-05',
        },
      ]),
      bomMap: jest.fn(),
    };

    const log = {
      create: jest.fn().mockResolvedValue({}),
      info: jest.fn(),
    };

    const errEvent = { handler: jest.fn().mockResolvedValue({}) };

    const erpManager = { save: jest.fn().mockResolvedValue(true) };

    const Order = { updateStatus: jest.fn().mockResolvedValue(true) };

    const OrderLog = {};

    const awsRepositories = { Repository: { get: jest.fn().mockResolvedValue(orderItemDetail) } };

    const lodash = { isEmpty: jest.fn().mockReturnValue(true) };

    const enabledStates = {
      failed: 'FAILED',
      delivered: 'DELIVERED',
      success: 'OK',
      error: 'ERROR',
    };

    const { transactions } = handler({ awsRepositories, lodash, Mapper, log, errEvent, enabledStates });

    await transactions(erpManager, Order, OrderLog, orders);

    expect(erpManager.save.mock.calls).toEqual([
      [
        {
          organizationId: '3043',
          erpClientId: '0500265522',
          orderDatetime: '2020-12-16T17:34:27z',
          orderDeliveryDate: '20200104',
          orderId: 600,
          requireErpConvertion: false,
          createdBy: 'B2B',
          items: [ 
            {
              erpProductId: '121545',
              quantity: 9,
            },
            {
              erpProductId: '121500',
              quantity: 9,
            },
            {
              erpProductId: '801010',
              quantity: 1,
            },
          ],
          discounts: [
            {
              discountType: 'A',
              discountValue: 10,
              erpDiscountClassId: 'ZC06',
              erpDiscountId: '0000029539',
              erpProductId: '000000000000121500',
              orderId: '600',
            },
            {
              discountType: 'A',
              discountValue: 10,
              erpDiscountClassId: 'ZC06',
              erpDiscountId: '0000029539',
              erpProductId: '000000000000121545',
              orderId: '600',
            },
          ]
        },
      ],
    ]);

  });
});