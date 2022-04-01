const clientsMock = {
  transactionId: '111111',
  organizationId: '3043',
  cpgId: '001',
  countryId: 'AR',
  clients: [
    {
      clientId: '001AR3043-ERP-TEST-A',
      fiscalId: '227777777722',
      fiscalName: 'Test SA',
      fantasyName: 'TEST-A SA',
      parentClientId: '8888888',
      erpClientId: 'ERP_TEST-A',
      salesOrganization: 'Test',
      distributionChannel: 'Masivo',
      address: {
        street: 'Salguero',
        doorNumber: '227',
        state: 'Buenos Aires',
        city: 'San Isidro',
        zipCode: '1609',
        observations: 'El unico lugar que vale la pena',
      },
      locks: [
        { erpLockId: '001AR3043-LOCK-DELETED' },
      ],
    },
  ],
};

module.exports = { clientsMock };