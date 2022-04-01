const handlerUser = require('../lambda');
const { userMock } = require('./__mocks__/user');

describe('GetUserName Lamda Function', () => {
  it('Should return user fisrtName', async () => {

    const user = userMock;
    const event = { data: 'pepe.perez@gmail.com' };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserNameByEmailOrPhone: jest.fn().mockResolvedValue({ firstName: user.firstName }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { user: { validateFoundUser: jest.fn() } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const result = await handlerUser({ repositories, experts, res }).getUserNameService(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    const { User, closeConnection } = await repositories();
    expect(User.getUserNameByEmailOrPhone.mock.calls).toEqual([
      [
        'pepe.perez@gmail.com',
      ],
    ]);
    expect(experts.user.validateFoundUser.mock.calls).toEqual([
      [
        { firstName: 'Pepe' },
      ],
    ]);
    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      data: { firstName: 'Pepe' },
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const user = userMock;
    const event = { data: 'pepe.perez@gmail.com' };

    const repositories = jest.fn().mockResolvedValue({
      User: { getUserNameByEmailOrPhone: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { user: { validateFoundUser: jest.fn() } };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const result = await handlerUser({ repositories, experts, res }).getUserNameService(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    const { User, closeConnection } = await repositories();
    expect(User.getUserNameByEmailOrPhone.mock.calls).toEqual([
      [
        'pepe.perez@gmail.com',
      ],
    ]);
    expect(experts.user.validateFoundUser.mock.calls).toEqual([]);
    expect(result).toEqual({
      httpStatus: 404,
      ok: true,
      code: 1001,
      errorType: 'Not Found',
      message: 'descripcion del error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});