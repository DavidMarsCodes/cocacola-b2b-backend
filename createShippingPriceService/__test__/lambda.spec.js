const handlerShippingPrice = require('../lambda');
const { shippingPriceMock } = require('./__mocks__/shippingPrice');

describe.skip('CreateShippingPrice Lambda Function', () => {
  it('should create shipping price', async() => {
    const event = shippingPriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const experts = {
      product: { validateUpsertShippingPrice: jest.fn().mockReturnValue(undefined), // undefined significa que pasó la validación
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

    const result = await handlerShippingPrice({ awsRepositories, experts, res }).createShippingPrice(event);

    expect(experts.product.validateUpsertShippingPrice.mock.calls).toEqual([ [ event ] ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([ [ 'shippingPriceToUpsert', event ] ]);
    expect(res.sendStatus.mock.calls).toEqual([ [ 201 ] ]);
    expect(result).toEqual({ httpStatus: 201 });
  });

  it('should return an error type Validation_error in case request parameters are incorrect', async () => {

    const event = shippingPriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const experts = {
      product: {
        validateUpsertShippingPrice: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 50,
              msg: 'validation_server_error',
              type: 'validation_error',
            }),
          };
        }),
      },
    };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 50, errorType = 'validation_error', status = 400) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerShippingPrice({ awsRepositories, experts, res }).createShippingPrice(event);

    expect(experts.product.validateUpsertShippingPrice.mock.calls).toEqual([ [ event ] ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([ [ 'validation_server_error', 50, 'validation_error', 400 ] ]);
    expect(result).toEqual({
      httpStatus: 400,
      ok: false,
      code: 50,
      errorType: 'validation_error',
      message: 'validation_server_error',
    });
  });

  it('Should return an unhandled error', async () => {

    const event = shippingPriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const experts = {
      product: { validateUpsertShippingPrice: jest.fn().mockReturnValue(undefined), // undefined significa que pasó la validación
      },
    };

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 50, errorType = 'validation_error', status = 400) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerShippingPrice({ awsRepositories, experts, res }).createShippingPrice(event);

    expect(experts.product.validateUpsertShippingPrice.mock.calls).toEqual([ [ event ] ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([ [ 'shippingPriceToUpsert', event ] ]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([ [ 'Internal Server Error', 500, 'Server Error', 500, '{"ok":false}' ] ]);
    expect(result).toEqual({
      httpStatus: 500,
      ok: false,
      code: 500,
      errorType: 'Server Error',
      message: 'Internal Server Error',
    });
  });
});
