const handler = require('../lambda');

describe('Initial User Validations', () => {
  it('It you should send an email.', async () => {

    const event = {
      Records: [
        {
          body: `{
                        "cpgId": "001",
                        "countryId": "CL",
                        "organizationId": "3043",
                        "erpOrderId": "0204268914",
                        "orderId": 832,
                        "orderStatus": "DELIVERED_CLT",
                        "sourceChannel": "B2B",
                        "email": "test@domain.com",
                        "amount": 58977,
                        "erpClientId": "fdaffa68828822",
                        "reason": "fkdffjdldf",
                        "name": "Nicolas",
                        "clientId": 1,
                        "streetAndNumber": "CALLE SAN DIEGO",
                        "deliveryDate": "2021-12-15"
                    }`,
        },
      ],
    };

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue({
          Item: {
            subject: 'subject email',
            message: 'mensaje del email',
          },
        }),
      },
    };

    const experts = { client: { validateEmailRequiredParams: jest.fn() } };

    const builder = {
      buildTemplateData: jest.fn().mockReturnValue({
        orderId: '0204268914',
        status: 'DELIVERED_CLT',
        amount: '$58.977',
        reason: 'fkdffjdldf',
        name: 'Nicolas',
        erpClientId: 'fdaffa68828822',
        clientId: 1,
      }, 'https://d22pkkvlw7ikjx.cloudfront.net'),
    };

    const validations = { statesEnabled: jest.fn().mockReturnValue(true) };

    const selectTemplateNameByStatus = jest.fn().mockReturnValue('{cpgId}_{countryId}_tracking_email_template');

    const getNameEmailTemplates = jest.fn().mockResolvedValue({
      CREATED: '{cpgId}_{countryId}_newOrder_email_template',
      DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
      REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
    });

    const templateParser = { templateNameParser: jest.fn().mockReturnValue('001_CL_tracking_email_template') };

    const tableName = 'devEmailTemplates';


    const getSourceEmail = jest.fn().mockResolvedValue('no-reply@dev.miportalb2b.com');

    const getUrlAws = jest.fn().mockResolvedValue('https://d22pkkvlw7ikjx.cloudfront.net');

    const strategies = {
      emailStrategy: jest.fn().mockReturnValue({
        setOrderEmail: jest.fn().mockReturnValue({
          templateParsedMessage: 'templateParsedMessage',
          subjectParsedMessage: 'subjectParsedMessage',
        }),
      }),
    };

    const ses = { sendEmail: jest.fn().mockResolvedValue() };

    const HandlerDates = { format: jest.fn().mockReturnValue('15/12/2021') };

    const { emailSender } = handler({ awsRepositories, experts, builder, validations, selectTemplateNameByStatus, getNameEmailTemplates, templateParser, tableName, getSourceEmail, getUrlAws, strategies, ses, HandlerDates });

    await emailSender(event);

    expect(experts.client.validateEmailRequiredParams.mock.calls).toEqual([
      [
        {
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
          streetAndNumber: 'CALLE SAN DIEGO',
          deliveryDate: '15/12/2021',
        },
      ],
    ]);
    expect(HandlerDates.format.mock.calls).toEqual([
      [
        '2021-12-15',
        'DD/MM/YYYY',
      ],
    ]);
    expect(builder.buildTemplateData.mock.calls).toEqual([
      [
        {
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
          streetAndNumber: 'CALLE SAN DIEGO',
          deliveryDate: '15/12/2021',
        },
        'https://d22pkkvlw7ikjx.cloudfront.net',
      ],
    ]);

    expect(validations.statesEnabled.mock.calls).toEqual([
      [
        {
          orderId: '0204268914',
          status: 'DELIVERED_CLT',
          amount: '$58.977',
          reason: 'fkdffjdldf',
          name: 'Nicolas',
          erpClientId: 'fdaffa68828822',
          clientId: 1,
        },
      ],
    ]);

    expect(getNameEmailTemplates.mock.calls).toEqual([ [] ]);

    expect(selectTemplateNameByStatus.mock.calls).toEqual([
      [
        'DELIVERED_CLT',
        {
          CREATED: '{cpgId}_{countryId}_newOrder_email_template',
          DEFAULT: '{cpgId}_{countryId}_tracking_email_template',
          REASON: '{cpgId}_{countryId}_tracking_email_template_reason',
        },
      ],
    ]);

    expect(templateParser.templateNameParser.mock.calls).toEqual([
      [
        '{cpgId}_{countryId}_tracking_email_template',
        {

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
          streetAndNumber: 'CALLE SAN DIEGO',
          deliveryDate: '15/12/2021',
        },
      ],
    ]);


    const { Repository } = awsRepositories;
    expect(Repository.get.mock.calls).toEqual([
      [
        'devEmailTemplates',
        { templateName: '001_CL_tracking_email_template' },
      ],
    ]);

    expect(getSourceEmail.mock.calls).toEqual([ [] ]);

    expect(strategies.emailStrategy.mock.calls).toEqual([
      [
        '{cpgId}_{countryId}_tracking_email_template',
      ],
    ]);


    expect(strategies.emailStrategy().setOrderEmail.mock.calls).toEqual([
      [
        {
          subject: 'subject email',
          message: 'mensaje del email',
          templateData: {
            orderId: '0204268914',
            status: 'DELIVERED_CLT',
            amount: '$58.977',
            reason: 'fkdffjdldf',
            name: 'Nicolas',
            erpClientId: 'fdaffa68828822',
            clientId: 1,
          },
        },
      ],
    ]);

    expect(ses.sendEmail.mock.calls).toEqual([
      [
        'no-reply@dev.miportalb2b.com',
        'test@domain.com',
        'subjectParsedMessage',
        'templateParsedMessage',
      ],
    ]);

  });


});