const shippingPriceMock = {
  transactionId: '11111111',
  cpgTransactionId: 'UUID',
  organizationId: '3043',
  cpgId: '001',
  countryId: 'AR',
  data: [
    {
      erpShippingPriceListId: '123123',
      products: [
        {
          validity_from: '26-11-2020',
          validity_to: '26-12-2020',
          erpClientId: '1233',
          erpProductId: '111122222',
          shippingPrice: 10,
          taxes: 1,
        },
        {
          validity_from: '26-11-2020',
          validity_to: '26-12-2020',
          erpClientId: '4566',
          erpProductId: '222211111',
          shippingPrice: 20,
          taxes: 2,
        },
      ],
    },
    {
      erpShippingPriceListId: '7777777',
      products: [
        {
          validity_from: '26-11-2020',
          validity_to: '26-12-2020',
          erpShippingPriceListId: 'ERP111',
          erpClientId: '1233',
          erpProductId: '111122222',
          shippingPrice: 10,
          taxes: 1,
        },
        {
          validity_from: '26-11-2020',
          validity_to: '26-12-2020',
          erpShippingPriceListId: 'ERP222',
          erpClientId: '4566',
          erpProductId: '222211111',
          shippingPrice: 20,
          taxes: 2,
        },
      ],
    },
  ],
};

const eventMock = { transactionId: '11111111' };

module.exports = {
  shippingPriceMock,
  eventMock,
};
