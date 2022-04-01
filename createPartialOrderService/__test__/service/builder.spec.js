const builder = require('../../services/builder');

describe('Builder method', () => {
  it('You should create an object of type params with the following properties cpgId | countryId | organizationId | clientId | deliverydate.', () => {
    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      orderId: '124', // Solo se envía si ya existe
      deliverydate: '2021-01-21T00:00:00.000Z',
      priceDateByCountry: '2021-01-21T00:00:00.000Z',
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
      ],
    };

    const params = builder.buildRequireParams(event);

    expect(params).toEqual({
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      clientId: 2,
      deliverydate: '2021-01-21T00:00:00.000Z',
    });
  });
});