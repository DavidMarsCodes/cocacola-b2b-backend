const calculate = require('../../services/taxCalculator');

describe('re calculate taxes', () => {
  it('the function that recalculates internal taxes should be called', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '124',
      orderDeliveryDate: '2021-01-21T00:00:00.000Z',
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 15,
          },
          productGroupId: 7,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 20,
          },
          productGroupId: 7,
        },
      ],
    };

    const Order = {
      calculateInterno: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateImpInt(9,2,100,50,0,"IMPI")': 15,
            'b2b.fn_CalculateImpInt(10,2,100,10,0,"IMPI")': 10,
          },
        ],
      ),
      calculateIva: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_fn_CalculateIva(9,2,100,50,0,15,"IVA")': 21,
            'b2b.fn_fn_CalculateIva(10,2,100,10,0,10,"IVA")': 11,
          },
        ],
      ),
      calculateGeneralTaxes: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateGeneralTaxes(9,2,100,50,0,15,21,"IMPG")': 5,
            'b2b.fn_CalculateGeneralTaxes(10,2,100,50,0,10,11,"IMPG")': 1,
          },
        ],
      ),
    };

    const PortfolioPrice = { getById: jest.fn().mockResolvedValue({ shippingPrice: '50' }) };

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

    const items = await calculate(event, Order, PortfolioPrice, taxType);

    expect(Order.calculateInterno).toHaveBeenCalled();

  });

  it('the function that recalculates iva should be called', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '124',
      orderDeliveryDate: '2021-01-21T00:00:00.000Z',
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 15,
          },
          productGroupId: 7,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 20,
          },
          productGroupId: 7,
        },
      ],
    };

    const Order = {
      calculateInterno: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateImpInt(9,2,100,50,0,"IMPI")': 15,
            'b2b.fn_CalculateImpInt(10,2,100,10,0,"IMPI")': 10,
          },
        ],
      ),
      calculateIva: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_fn_CalculateIva(9,2,100,50,0,15,"IVA")': 21,
            'b2b.fn_fn_CalculateIva(10,2,100,10,0,10,"IVA")': 11,
          },
        ],
      ),
      calculateGeneralTaxes: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateGeneralTaxes(9,2,100,50,0,15,21,"IMPG")': 5,
            'b2b.fn_CalculateGeneralTaxes(10,2,100,50,0,10,11,"IMPG")': 1,
          },
        ],
      ),
    };

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

    const items = await calculate(event, Order, taxType);

    expect(Order.calculateIva).toHaveBeenCalled();
  });

  it('the function that recalculates general taxes should be called', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '124',
      orderDeliveryDate: '2021-01-21T00:00:00.000Z',
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 15,
          },
          productGroupId: 7,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 20,
          },
          productGroupId: 7,
        },
      ],
    };

    const Order = {
      calculateInterno: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateImpInt(9,2,100,50,0,"IMPI")': 15,
            'b2b.fn_CalculateImpInt(10,2,100,10,0,"IMPI")': 10,
          },
        ],
      ),
      calculateIva: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_fn_CalculateIva(9,2,100,50,0,15,"IVA")': 21,
            'b2b.fn_fn_CalculateIva(10,2,100,10,0,10,"IVA")': 11,
          },
        ],
      ),
      calculateGeneralTaxes: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateGeneralTaxes(9,2,100,50,0,15,21,"IMPG")': 5,
            'b2b.fn_CalculateGeneralTaxes(10,2,100,50,0,10,11,"IMPG")': 1,
          },
        ],
      ),
    };

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

    const items = await calculate(event, Order, taxType);

    expect(Order.calculateGeneralTaxes).toHaveBeenCalled();
  });

  it('The property should return taxes with the sum of the internal, IVA and general properties.', async () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '124',
      orderDeliveryDate: '2021-01-21T00:00:00.000Z',
      items: [
        {
          portfolioPriceId: 14,
          productId: 9,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 50,
          },
          productGroupId: 7,
        },
        {
          portfolioPriceId: 15,
          productId: 10,
          quantity: 2,
          price: {
            listPrice: 100,
            finalPrice: 0,
            taxes: 20,
            discounts: 0,
            others: 0,
            shippingPrice: 50,
          },
          productGroupId: 7,
        },
      ],
    };

    const Order = {
      calculateInterno: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateImpInt(9,2,100,50,0,"IMPI")': 15,
            'b2b.fn_CalculateImpInt(10,2,100,50,0,"IMPI")': 10,
          },
        ],
      ),
      calculateIva: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateIva(9,2,100,50,0,15,"IVA")': 21,
            'b2b.fn_CalculateIva(10,2,100,50,0,10,"IVA")': 11,
          },
        ],
      ),
      calculateGeneralTaxes: jest.fn().mockResolvedValue(
        [
          {
            'b2b.fn_CalculateGeneralTaxes(9,2,100,50,0,15,21,"IMPG")': 5,
            'b2b.fn_CalculateGeneralTaxes(10,2,100,50,0,10,11,"IMPG")': 1,
          },
        ],
      ),
    };

    const taxType = {
      internalTaxes: 'IMPI',
      iva: 'IVA',
      generalTaxes: 'IMPG',
      percepcion: 'PERC',
    };

    const items = await calculate(event, Order, taxType);

    expect(items).toEqual([
      {
        portfolioPriceId: 14,
        productId: 9,
        quantity: 2,
        price: {
          listPrice: 100,
          finalPrice: 191,
          taxes: 41,
          discounts: 0,
          others: 0,
          shippingPrice: 50,
        },
        productGroupId: 7,
      },
      {
        portfolioPriceId: 15,
        productId: 10,
        quantity: 2,
        price: {
          listPrice: 100,
          finalPrice: 172,
          taxes: 22,
          discounts: 0,
          others: 0,
          shippingPrice: 50,
        },
        productGroupId: 7,
      },
    ]);
  });

});