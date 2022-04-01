const handler = require('../../../../services/strategies/emailStrategy/newOrderEmail');

describe('Email strategies', () => {
  it('It you should select the order confirmation template.', () => {

    const templateParser = { templateNewOrderParser: jest.fn().mockReturnValue('templateParse') };

    const subjectParser = { subjectNewOrderParser: jest.fn().mockReturnValue('subjectParse') };

    const message = 'template';
    const subject = 'subject';
    const templateData = {
      orderId: '126',
      amount: '221878.000',
      name: 'Nicolas',
      status: 'created',
      erpClientId: '4576211658',
    };

    const { set } = handler({ templateParser, subjectParser });

    const result = set({ message, subject, templateData });

    expect(templateParser.templateNewOrderParser.mock.calls).toEqual([
      [
        'template',
        {
          orderId: '126',
          amount: '221878.000',
          name: 'Nicolas',
          status: 'created',
          erpClientId: '4576211658',
        },
      ],
    ]);

    expect(subjectParser.subjectNewOrderParser.mock.calls).toEqual([
      [
        'subject',
        {
          orderId: '126',
          amount: '221878.000',
          name: 'Nicolas',
          status: 'created',
          erpClientId: '4576211658',
        },
      ],
    ]);

    expect(result).toEqual({
      templateParsedMessage: 'templateParse',
      subjectParsedMessage: 'subjectParse',
    });

  });
});