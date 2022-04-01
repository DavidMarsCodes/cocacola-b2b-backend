const orderHeader = {
  clientId: 1,
  cpgId: 1,
  countryId: 'AR',
  organizationId: 1,
  erpOrderId: 123,
  status: 'active',
  deleted: false,
  orderDeliveryDate: "2020-10-30T12:34:56'Z'",
  createdBy: 'carrito',
  createdTime: "2020-10-29T12:34:56'Z'",
  updatedBy: null,
  updatedTime: null,
};
const event = {
  transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
  cpgId: '001',
  countryId: 'AR',
  organizationId: '3043',
  clientId: 2,
  orderId: '124', // Solo se envía si ya existe
  orderDeliveryDate: '2021-01-21T00:00:00.000Z',
  items: [
    {
      portfolioPriceId: 14,
      productId: 9,
      quantity: 2,
      listPrice: 100,
      finalPrice: 120,
      taxes: 20,
      discounts: 0,
      others: 0,
      productGroupId: 7,
    },
    {
      portfolioPriceId: 15,
      productId: 10,
      quantity: 2,
      listPrice: 100,
      finalPrice: 120,
      taxes: 20,
      discounts: 0,
      others: 0,
      productGroupId: 7,
    },
  ],
};

module.exports = {
  orderHeader,
  event,
};