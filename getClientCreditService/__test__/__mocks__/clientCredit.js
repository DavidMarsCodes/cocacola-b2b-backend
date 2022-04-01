const resmock = {
  httpStatus: 200,
  ok: true,
  code: 0,
  pagination: { limit: 100, offset: 0, count: 2, currentPage: 1 },
  data: [
    {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      creditLimit: '100000000.000',
      available: '900.000',
      currency: 'CLP',
      Segment: { segmentId: 1, name: 'NART ' },
      expensed: 99999100,
    },
    {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      creditLimit: '100000000.000',
      available: '90000000.000',
      currency: 'CLP',
      Segment: { segmentId: 2, name: 'ALCOHOLES' },
      expensed: 10000000,
    },
  ],
};

const creditLimitMock = {
  creditLimit: [
    {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      creditLimit: '100000000.000',
      available: '900.000',
      currency: 'CLP',
      Segment: { segmentId: 1, name: 'NART ' },
    },
    {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      creditLimit: '100000000.000',
      available: '90000000.000',
      currency: 'CLP',
      Segment: { segmentId: 2, name: 'ALCOHOLES' },
    },
  ],
  currentPage: NaN,
  count: 2,
};


module.exports = {
  resmock,
  creditLimitMock,
};