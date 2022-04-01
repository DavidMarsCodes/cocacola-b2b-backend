const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should save an order in the dynamoDB database.', async () => {

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      data: [
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-10T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-11T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-12T12:00:00z',
        },
      ],
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const experts = { invoicePlan: { validateRequiredParamsCreateInvoicePlan: jest.fn() } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'invoicePlanToUpsert' });

    const res = { sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }) };

    const { createInvoicePlan } = handler({ awsRepositories, getTableName, experts, res });
    await createInvoicePlan(event);

    expect(experts.invoicePlan.validateRequiredParamsCreateInvoicePlan.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          data: [
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-10T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-11T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-12T12:00:00z',
            },
          ],
        },
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'invoicePlanToUpsert',
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          data: [
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-10T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-11T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-12T12:00:00z',
            },
          ],
        },
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
  });

  it('It should answer a validation error in case any of the required parameters are invalid.', async () => {

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      data: [
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-10T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-11T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-12T12:00:00z',
        },
      ],
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'invoicePlanToUpsert' });

    const experts = {
      invoicePlan: {
        validateRequiredParamsCreateInvoicePlan: jest.fn(data => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'Validation_server_error',
              type: 'Validation_error',
            }),
          };
        }),
      },
    };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createInvoicePlan } = handler({ awsRepositories, getTableName, experts, res });
    await createInvoicePlan(event);

    expect(experts.invoicePlan.validateRequiredParamsCreateInvoicePlan.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          data: [
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-10T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-11T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-12T12:00:00z',
            },
          ],
        },
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,

      ],
    ]);

  });

  it('It should throw an error because of not being able to store the data in DynamoDB.', async () => {

    const event = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
      data: [
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-10T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-11T18:00:00z',
        },
        {
          erpInvoicePlanId: 'asdasd676d7a6sdasd',
          deadline: '2020-12-12T12:00:00z',
        },
      ],
    };

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'invoicePlanToUpsert' });

    const experts = { invoicePlan: { validateRequiredParamsCreateInvoicePlan: jest.fn() } };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { createInvoicePlan } = handler({ awsRepositories, getTableName, experts, res });
    await createInvoicePlan(event);

    expect(experts.invoicePlan.validateRequiredParamsCreateInvoicePlan.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          data: [
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-10T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-11T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-12T12:00:00z',
            },
          ],
        },
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'invoicePlanToUpsert',
        {
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          data: [
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-10T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-11T18:00:00z',
            },
            {
              erpInvoicePlanId: 'asdasd676d7a6sdasd',
              deadline: '2020-12-12T12:00:00z',
            },
          ],
        },
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        '{"ok":false}',
      ],
    ]);

  });

});