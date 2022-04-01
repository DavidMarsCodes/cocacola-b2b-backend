const userMock = {
  firstName: 'Margarita',
  lastName: 'Reynoso',
  email: 'margarita.reynoso@gmail.com',
  cellphone: '+5493517997667',
  password: 'Marga2017',
  fieldSelectedToLogin: 'email',
  client: {
    fiscalId: '20236846998',
    clientId: '001AR3043-ERP-ANDRES',
  },
};

const contextMock = {};

const userCreateResultMock = event => ({
  firstName: event.firstName,
  lastName: event.lastName,
  userId: 3,
  updatedBy: 'TESTING',
  lastUpdate: 'DATE',
});

const responseUserMock = event => ({
  ok: true,
  code: 0,
  data: userCreateResultMock(event),
});

module.exports = {
  userMock,
  contextMock,
  userCreateResultMock,
  responseUserMock,
};