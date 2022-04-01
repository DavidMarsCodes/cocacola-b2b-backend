const handler = require('../../services/templateMapper');

describe('templateParser', () => {
  it('It you should return string with parsed data for email', () => {

    const template = '${orderId} ${name} ${status}';

    const templateData = {
      orderId: '111',
      name: 'Pepe',
      status: 'sent',
    };

    const { templateUpdateStatusParser } = handler;

    const result = templateUpdateStatusParser(template, templateData);

    expect(result).toEqual('111 Pepe sent');
  });

  it('It you should return string with parsed data for email with property reason', () => {

    const template = '${orderId} ${name} ${status} ${reason}';

    const templateData = {
      orderId: '111',
      name: 'Pepe',
      status: 'sent',
      reason: 'reason email',
    };

    const { templateUpdateStatusReasonParser } = handler;

    const result = templateUpdateStatusReasonParser(template, templateData);

    expect(result).toEqual('111 Pepe sent reason email');
  });

  it('It you should return string with parsed template', () => {

    const template = '${orderId} ${name} ${amount}';

    const templateData = {
      orderId: '111',
      name: 'Pepe',
      amount: '222',
    };

    const { templateNewOrderParser } = handler;

    const result = templateNewOrderParser(template, templateData);

    expect(result).toEqual('111 Pepe 222');
  });
});