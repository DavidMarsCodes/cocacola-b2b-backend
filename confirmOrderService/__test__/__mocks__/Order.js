const order = {
  clientId: 1,
  cpgId: 1,
  countryId: 'AR',
  organizationId: 1,
  erpOrderId: 123,
  status: 'active',
  deleted: false,
  orderDeliveryDate: "2020-10-30T12:34:56'Z'",
  items: [ {
    productId: 11111111111,
    quantity: 5,
    listPrice: 150.00,
    finalPrice: 121.00,
    taxes: 21.00,
    discounts: 50.00,
    others: 15.00,
  },
  {
    productId: 22222222222,
    quantity: 8,
    listPrice: 12345.45,
    finalPrice: 123.45,
    taxes: 123.45,
    discounts: 123.45,
    others: 123.45,
  },
  ],
  createdBy: 'carrito',
  createdTime: "2020-10-29T12:34:56'Z'",
  updatedBy: null,
  updatedTime: null,

};

module.exports = { order };