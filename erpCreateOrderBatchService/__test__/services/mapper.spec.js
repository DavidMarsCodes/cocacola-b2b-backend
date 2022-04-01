const Mapper = require('../../services/mapper');
const { Discount, OrderItem, Order } = require('../../services/entities');


describe('Mapper Class', () => {

  describe('Discount Mapper', () => {

    it('It should return an array with an element of type discount.', () => {

      const data = {
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
      };

      const res = Mapper.discountMap('1795', data);

      expect(res).toEqual([
        {
          orderId: '1795',
          erpProductId: '000000000000121545',
          erpDiscountclassID: 'ZB06',
          erpDiscountId: '0000005838',
          discountType: 'S',
          valDiscount: 293.624,
        },
      ]);

      expect(res[0]).toBeInstanceOf(Discount);


    });

    it('It should return an array with multiple elements of type discount.', () => {

      const data = {
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
      };

      const res = Mapper.discountMap('1795', data);

      expect(res).toEqual([
        {
          orderId: '1795',
          erpProductId: '000000000000121545',
          erpDiscountclassID: 'ZB06',
          erpDiscountId: '0000005838',
          discountType: 'S',
          valDiscount: 293.624,
        },
        {
          orderId: '1795',
          erpProductId: '000000000000121545',
          erpDiscountclassID: 'ZC06',
          erpDiscountId: '0000029539',
          discountType: 'A',
          valDiscount: 10,
        },
      ]);

      expect(res[0]).toBeInstanceOf(Discount);
      expect(res[1]).toBeInstanceOf(Discount);

    });

    it('It should return an array with multiple elements of type discount with the property valDiscount with the value of undefinded.', () => {

      const data = {
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
      };

      const res = Mapper.discountMap('1795', data);

      expect(res).toEqual([
        {
          orderId: '1795',
          erpProductId: '000000000000121545',
          erpDiscountclassID: 'ZB06',
          erpDiscountId: '0000005838',
          discountType: 'S',
          valDiscount: undefined,
        },
        {
          orderId: '1795',
          erpProductId: '000000000000121545',
          erpDiscountclassID: 'ZC06',
          erpDiscountId: '0000029539',
          discountType: 'A',
          valDiscount: undefined,
        },
      ]);

      expect(res[0]).toBeInstanceOf(Discount);
      expect(res[1]).toBeInstanceOf(Discount);

    });

    it('It should return an empty array in case of receiving an empty array.', () => {

      const data = [];

      const res = Mapper.discountMap('179', data);

      expect(res).toEqual([]);
    });

    it('It should return an empty array in case of receiving an empty array.', () => {

      const data = {
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
      };

      const res = Mapper.discountMap('1795', data);

      expect(res).toEqual([]);
    });

    it('It should return an empty array in case of receiving an empty price.', () => {

      const data = {
        calculatedItems: [
          {
            erpProductId: '000000000000121545',
            name: 'Sprite Lima Limon Lata 350ML 1X6 und.',
            portfolioPriceId: 221,
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
      };

      const res = Mapper.discountMap('179', data);

      expect(res).toEqual([]);
    });


    it('It should return an empty array in case of receiving an empty discountsApplied.', () => {

      const data = {
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
              discountsApplied: [],
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
      };

      const res = Mapper.discountMap('179', data);

      expect(res).toEqual([]);
    });



  });

  describe('OrderItem Mapper', () => {

    it('It should return an array with an element of type OrderItem.', () => {

      const data = [
        { erpProductId: '000000000000122501', quantity: 1 },
      ];

      const res = Mapper.orderItemMap(data);

      expect(res).toEqual([
        { erpProductId: '000000000000122501', quantity: 1 },
      ]);

      expect(res[0]).toBeInstanceOf(OrderItem);

    });

    it('It should return an array with multiple elements of type OrderItem.', () => {

      const data = [
        { erpProductId: '000000000000122501', quantity: 1 },
        { erpProductId: '000000000000027099', quantity: 5 },
        { erpProductId: '000000000000027166', quantity: 2 },
        { erpProductId: '000000000000027306', quantity: 8 },
      ];

      const res = Mapper.orderItemMap(data);

      expect(res).toEqual([
        { erpProductId: '000000000000122501', quantity: 1 },
        { erpProductId: '000000000000027099', quantity: 5 },
        { erpProductId: '000000000000027166', quantity: 2 },
        { erpProductId: '000000000000027306', quantity: 8 },
      ]);

      expect(res[0]).toBeInstanceOf(OrderItem);
      expect(res[1]).toBeInstanceOf(OrderItem);
      expect(res[2]).toBeInstanceOf(OrderItem);
      expect(res[3]).toBeInstanceOf(OrderItem);

    });

  });

  describe('Order Mapper', () => {

    it('It should return an instance of an Order.', () => {

      const discounts = [
        {
          orderId: '179',
          erpProductId: '000000000000122501',
          erpDiscountClassId: 'ZB06',
          erpDiscountId: '0000059664',
          discountType: 'S',
          valDiscount: 471,
        },
        {
          orderId: '179',
          erpProductId: '000000000000027099',
          erpDiscountClassId: 'ZB06',
          erpDiscountId: '0000059679',
          discountType: 'S',
          valDiscount: 310,
        },
        {
          orderId: '179',
          erpProductId: '000000000000027166',
          erpDiscountClassId: 'ZB06',
          erpDiscountId: '0000066672',
          discountType: 'S',
          valDiscount: 310,
        },
      ];

      const orderItems = [
        { erpProductId: '000000000000122501', quantity: 1 },
        { erpProductId: '000000000000027099', quantity: 5 },
        { erpProductId: '000000000000027166', quantity: 2 },
        { erpProductId: '000000000000027306', quantity: 8 },
      ];

      const order = {
        orderId: 179,
        orderDeliveryDate: '2021-02-19T00:00:00.000Z',
        organizationId: '3043',
        createdBy: 'nicolas.beltran@incluit.com',
        orderDatetime: '2021-04-08T14:07:43.000Z',
        requireErpConvertion: false,
        erpClientId: '0500266030',
        sourceChannel: 'B2B',
      };

      const orderDelivery = [
        {
          deliveryType: 'delivery',
          deliveryDate: '2021-02-19T00:00:00.000Z',
        },
      ];

      const res = Mapper.orderMap(order, orderItems, discounts, orderDelivery);

      expect(res).toEqual({
        orderId: 179,
        orderDeliveryDate: '2021-02-19T00:00:00.000Z',
        organizationId: '3043',
        createdBy: 'nicolas.beltran@incluit.com',
        orderDatetime: '2021-04-08T14:07:43.000Z',
        requireErpConvertion: false,
        erpClientId: '0500266030',
        sourceChannel: 'B2B',
        items: [
          { erpProductId: '000000000000122501', quantity: 1 },
          { erpProductId: '000000000000027099', quantity: 5 },
          { erpProductId: '000000000000027166', quantity: 2 },
          { erpProductId: '000000000000027306', quantity: 8 },
        ],
        orderDelivery: [
          {
            deliveryType: 'delivery',
            deliveryDate: '2021-02-19T00:00:00.000Z',
          },
        ],
        discount: [
          {
            orderId: '179',
            erpProductId: '000000000000122501',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000059664',
            discountType: 'S',
            valDiscount: 471,
          },
          {
            orderId: '179',
            erpProductId: '000000000000027099',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000059679',
            discountType: 'S',
            valDiscount: 310,
          },
          {
            orderId: '179',
            erpProductId: '000000000000027166',
            erpDiscountClassId: 'ZB06',
            erpDiscountId: '0000066672',
            discountType: 'S',
            valDiscount: 310,
          },
        ],
      });

      expect(res).toBeInstanceOf(Order);

    });

  });

});