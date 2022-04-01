const shippingPriceMock = {
  transactionId: '111111',
  cpgTransactionId: 'UUID',
  organizationId: '3043',
  cpgId: '001',
  countryId: 'AR',
  data: [
    {
      erpShippingPriceListId: 'test1',
      products: [
        {
          validityFrom: '26-11-2020',
          validityTo: '26-12-2020',
          erpClientId: 'ERP_DISCO',
          erpProductId: 'CC-R-2.5-PET',
          shippingPrice: 10,
          taxes: 1,
        },
        {
          validityFrom: '26-11-2020',
          validityTo: '26-12-2020',
          erpClientId: 'ERP_DISCO',
          erpProductId: 'CC-R-3.0-PET',
          shippingPrice: 20,
          taxes: 2,
        },
      ],
    },
    {
      erpShippingPriceListId: 'test2',
      products: [
        {
          validityFrom: '26-11-2020',
          validityTo: '26-12-2020',
          erpClientId: 'ERP_CLLIENT2',
          erpProductId: 'CC-NR-3.0-PET',
          shippingPrice: 10,
          taxes: 1,
        },
        {
          validityFrom: '26-11-2020',
          validityTo: '26-12-2020',
          erpClientId: 'ERP_CLLIENT2',
          erpProductId: 'TB-NR-2.0-VIDRIO',
          shippingPrice: 20,
          taxes: 2,
        },
      ],
    },
  ],
};

module.exports = { shippingPriceMock };
