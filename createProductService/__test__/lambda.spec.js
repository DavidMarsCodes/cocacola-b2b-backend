const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should save an order in the dynamoDB database.', async () => {

    const event = {
      countryId: 'AR',
      cpgId: '001',
      data: [
        {
          erpClientId: 'ERP_TEST-B',
          erpProductId: 'CC-R-0.5-VIDRIO',
          quantity: 10,
        },
      ],
      createdTime: expect.any(String),
      organizationId: '3043',
      transactionId: '111111',
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devProductToUpsert' });

    const experts = { product: { validateCreateProductData: jest.fn() } };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const { createProductService } = handler({ awsRepositories, getTableName, experts, res });
    await createProductService(event);

    expect(experts.product.validateCreateProductData.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(awsRepositories.Repository.create.mock.calls).toMatchSnapshot([
      [
        'devProductToUpsert',
        event,
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
      countryId: 'AR',
      cpgId: '001',
      data: [
        {
          erpClientId: 'ERP_TEST-B',
          erpProductId: 'CC-R-0.5-VIDRIO',
          quantity: 10,
        },
      ],
      createdTime: expect.any(String),
      organizationId: '3043',
      transactionId: '111111',
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devProductToUpsert' });

    const experts = {
      product: {
        validateCreateProductData: jest.fn(data => {
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

    const { createProductService } = handler({ awsRepositories, getTableName, experts, res });
    await createProductService(event);

    expect(getTableName.mock.calls).toEqual([ ]);

    expect(experts.product.validateCreateProductData.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

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
      countryId: 'AR',
      cpgId: '001',
      data: [
        {
          erpClientId: 'ERP_TEST-B',
          erpProductId: 'CC-R-0.5-VIDRIO',
          quantity: 10,
        },
      ],
      createdTime: expect.any(String),
      organizationId: '3043',
      transactionId: '111111',
    };

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const experts = { product: { validateCreateProductData: jest.fn() } };

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

    const { createProductService } = handler({ awsRepositories, experts, res });
    await createProductService(event);

    expect(experts.product.validateCreateProductData.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        '{}',
      ],
    ]);

  });

});