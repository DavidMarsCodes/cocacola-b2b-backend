const handlerBasePrice = require('../lambda');
const { basePriceMock } = require('./__mocks__/basePrice');

describe('CreateBasePrice Lambda Function', () => {
  it('Should create base price', async() => {

    const event = basePriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const experts = { basePrice: { validateUpsertBasePrice: jest.fn().mockReturnValue(undefined) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devPriceBaseToUpsert' });

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
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

    const result = await handlerBasePrice({ awsRepositories, getTableName, experts, res }).createBasePrice(event);

    expect(experts.basePrice.validateUpsertBasePrice.mock.calls).toEqual([
      [ event ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [ 'devPriceBaseToUpsert', event ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
    expect(result).toEqual({ httpStatus: 201 });
  });

  it('should return an error type Validation_error in case request parameters are incorrect', async () => {
    const event = basePriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({}) } };

    const experts = {
      basePrice: {
        validateUpsertBasePrice: jest.fn(() => {
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

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devPriceBaseToUpsert' });

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
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

    const result = await handlerBasePrice({ awsRepositories, getTableName, experts, res }).createBasePrice(event);

    expect(experts.basePrice.validateUpsertBasePrice.mock.calls).toEqual([
      [ event ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'validation_server_error',
        50,
        'validation_error',
        400,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 400,
      ok: false,
      code: 50,
      errorType: 'validation_error',
      message: 'validation_server_error',
    });

  });

  it('Should return an unhandled error', async () => {
    const event = basePriceMock;

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue(false) } };

    const experts = { basePrice: { validateUpsertBasePrice: jest.fn().mockReturnValue(undefined) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devPriceBaseToUpsert' });

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
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

    const result = await handlerBasePrice({ awsRepositories, getTableName, experts, res }).createBasePrice(event);

    expect(experts.basePrice.validateUpsertBasePrice.mock.calls).toEqual([
      [ event ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [ 'devPriceBaseToUpsert', event ],
    ]);
    expect(res.sendStatus.mock.calls).toEqual([]);
    expect(res.error.mock.calls).toEqual([
      [
        'internal_server_error',
        0,
        'server_error',
        500,
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 500,
      ok: false,
      code: 0,
      errorType: 'server_error',
      message: 'internal_server_error',
    });

  });
});