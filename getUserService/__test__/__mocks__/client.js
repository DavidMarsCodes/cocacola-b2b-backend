const eventMock = {
  cpgId: '001',
  countryId: 'AR',
  organizationId: '3043',
  transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a674',
  userId: '1',
  username: 'andres.reynoso@incluit.com',
  b2bSession: { Authorization: 'Bearer tokenTest' },
  clientId: 2,
};

const userMock = {
  cpgId: '001',
  countryId: 'AR',
  transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
  organizationId: '3043',
  firstName: 'MaxiTest',
  lastName: 'BeltranTest',
  email: 'maxi_andina123456789999@gmail.com',
  cellphone: '+541169853429',
  password: 'Nic@2023',
  fieldSelectedToLogin: 'email',
  client: {
    fiscalId: '2222222222',
    erpClientId: '500322361',
  },
};


module.exports = {
  userMock,
  eventMock,
};