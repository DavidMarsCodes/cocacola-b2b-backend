const handlerShippingPrice = require('../lambda');
const { shippingPriceMock, eventMock } = require('./__mocks__/shippingPrice');

describe.skip('UpsertShippingPrice Lambda Function', () => {
  it.skip('should upsert shipping price ', async() => {

    const event = eventMock;

    const data = shippingPriceMock;

    const awsRepositories = { ShippingPrice: { get: jest.fn().mockResolvedValue({}) } };

    const repositories = {
      Product: { upsert: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    };

    const experts = {
      product: { validateUpsertShippingPrice: jest.fn().mockReturnValue(undefined), // undefined significa que pasó la validación
      },
    };

    const res = {
      success: jest.fn((data, status = 200) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data,
      })),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const result = await handlerShippingPrice({ awsRepositories, repositories, experts, res }).upsertShippingPrice(event);

    expect(awsRepositories.ShippingPrice.get.mock.calls).toEqual([ [ 'shippingPriceToUpsert', '11111111' ] ]);
    expect(repositories.Product.upsert.mock.calls).toEqual([ [ data ] ]);

  });
});
