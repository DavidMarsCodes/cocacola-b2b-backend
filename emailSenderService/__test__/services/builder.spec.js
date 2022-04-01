const handler = require('../../services/builder');

describe('builder', () => {
  it('It you should return object with email data for template', () => {

    const data = {
      orderId: 126,
      erpOrderId: '0500',
    };

    const orderData = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      erpOrderId: '0204268914',
      orderId: 832,
      orderStatus: 'DELIVERED_CLT',
      sourceChannel: 'B2B',
      email: 'test@domain.com',
      amount: 58977,
      erpClientId: 'fdaffa68828822',
      reason: 'fkdffjdldf',
      name: 'Nicolas',
      clientId: 1,
    };

    const urlAws = 'https://d22pkkvlw7ikjx.cloudfront.net';

    const { buildTemplateData } = handler;

    const result = buildTemplateData(orderData, urlAws);

    expect(result).toEqual({
      orderId: '0204268914',
      status: 'DELIVERED_CLT',
      amount: '$58.977',
      reason: 'fkdffjdldf',
      name: 'Nicolas',
      erpClientId: 'fdaffa68828822',
      urlAws: 'https://d22pkkvlw7ikjx.cloudfront.net',
      clientId: 1,
      deliveryDate: '',
      streetAndNumber: '',
    });
  });

});