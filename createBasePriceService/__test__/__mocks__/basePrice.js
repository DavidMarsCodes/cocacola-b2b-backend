const basePriceMock = [
  {
    coinId: 'string',
    description: 'string',
    products: [
      {
        validity_from: 'string',
        validity_to: 'string',
        productId: 'string',
        basePrice: 0,
        taxes: 0,
        discounts: [
          {
            percentage: 0,
            descrption: 'string',
          },
        ],
      },
    ],
  },
];

module.exports = { basePriceMock };