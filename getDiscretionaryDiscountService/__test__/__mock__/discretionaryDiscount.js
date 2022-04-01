const data = [
  {
    discountId: 0,
    name: 'Promo 1',
    detail: '10% descuento Coca Cola Light',
    active: true,
    limitPrice: 990,
    modifiedBy: 'Pedro Álvarez',
    validityTo: '08-09-2022',
    updatedTime: '02-09-2021 17:42',
  },
  {
    discountId: 0,
    name: 'Promo 2',
    detail: '20% descuento Coca Cola Zero',
    active: true,
    limitPrice: 990,
    modifiedBy: 'Pedro Álvarez',
    validityTo: '08-09-2022',
    updatedTime: '02-09-2021 17:50',
  },
];

const event = {
  b2bSession: { Authorization: 'Bearer eyJraPQiOiJ0bEpScHE3MlpSXC8rNlNxT04xbThjY2dRcXJpUzJmXC8zVGhjSVlGaXZWN1k9IiwiYWxnIjoiUlMyNTYifQ2' },
  cpgId: '001',
  countryId: 'CL',
  organizationId: '3043',
  transactionId: '16fefcc2-28e3-11eb-adc1-0242ac1200123',
  cutoffDays: 20,
  clientId: 2,
  offset: 0,
  limit: 40,
};

const pagination = {
  offset: 0,
  limit: 40,
  count: 10,
  currentPage: 1,
};

module.exports = {
  data,
  event,
  pagination,
};