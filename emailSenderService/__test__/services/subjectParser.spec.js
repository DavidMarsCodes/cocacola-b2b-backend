const handler = require('../../services/subjectMapper');

describe('subjectParser', () => {
  it('It you should return string with parsed data for subject', () => {

    const subject = 'Test subject';

    const templateData = {
      orderId: '111',
      name: 'Pepe',
      status: 'sent',
      erpClientId: 'erp123',
    };

    const { subjectUpdateStatusParser } = handler;

    const result = subjectUpdateStatusParser(subject, templateData);

    expect(result).toEqual('Test subject');
  });

  it('It you should return string with parsed data for subject', () => {

    const subject = 'Test subject';

    const templateData = {
      orderId: '111',
      erpClientId: 'erp123',
    };

    const { subjectNewOrderParser } = handler;

    const result = subjectNewOrderParser(subject, templateData);

    expect(result).toEqual('Test subject');
  });
});