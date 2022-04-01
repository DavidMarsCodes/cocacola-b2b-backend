const handler = require('../../../../services/strategies/emailStrategy/updateStatusOrderEmail');

describe('Email strategies', () => {
  it('It you should select the order confirmation template.', () => {

    const templateParser = { templateUpdateStatusParser: jest.fn().mockReturnValue('templateParse') };

    const subjectParser = { subjectUpdateStatusParser: jest.fn().mockReturnValue('subjectParse') };

    const statusTranslate = jest.fn().mockReturnValue('bloqueado');

    const message = 'template';
    const subject = 'subject';
    const templateData = {
      orderId: '126',
      amount: '221878.000',
      name: 'Nicolas',
      status: 'blocked',
      erpClientId: '4576211658',
    };

    const { set } = handler({ templateParser, subjectParser, statusTranslate });

    const result = set({ message, subject, templateData });

    expect(statusTranslate.mock.calls).toEqual([
      [
        {
          orderId: '126',
          amount: '221878.000',
          name: 'Nicolas',
          status: 'bloqueado',
          erpClientId: '4576211658',
        },
      ],
    ]);

    expect(templateParser.templateUpdateStatusParser.mock.calls).toEqual([
      [
        'template',
        {
          orderId: '126',
          amount: '221878.000',
          name: 'Nicolas',
          status: 'bloqueado',
          erpClientId: '4576211658',
        },
      ],
    ]);

    expect(subjectParser.subjectUpdateStatusParser.mock.calls).toEqual([
      [
        'subject',
        {
          orderId: '126',
          amount: '221878.000',
          name: 'Nicolas',
          status: 'bloqueado',
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