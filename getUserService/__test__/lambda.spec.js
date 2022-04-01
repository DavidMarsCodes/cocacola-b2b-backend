const handlerClient = require('../lambda');
const { userMock, eventMock } = require('./__mocks__/client');

describe('GetUser Lamda Function', () => {
  it('Request the data of a user.', async () => {

    // Create mockups.
    const event = eventMock;
    const user = userMock;

    const repositories = jest.fn().mockResolvedValue({
      User: { getByUserName: jest.fn().mockResolvedValue(user) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { user: { validateFoundUser: jest.fn().mockReturnValue({}) } };

    const accessControl = { getUserAuthorization: jest.fn().mockResolvedValue({}) };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: user,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const result = await handlerClient({ accessControl, repositories, experts, res }).getUser(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(accessControl.getUserAuthorization.mock.calls).toEqual([
      [
        'Bearer tokenTest',
        'andres.reynoso@incluit.com',
      ],
    ]);
    const { User, closeConnection } = await repositories();
    expect(User.getByUserName.mock.calls).toEqual([
      [
        'andres.reynoso@incluit.com',
      ],
    ]);
    expect(experts.user.validateFoundUser.mock.calls).toEqual([
      [
        {
          cpgId: '001',
          countryId: 'AR',
          transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
          organizationId: '3043',
          firstName: 'MaxiTest',
          lastName: 'BeltranTest',
          email: 'maxi_andina123456789999@gmail.com',
          cellphone: '+541169853429',
          password: 'Nic@2023',
          fieldSelectedToLogin: 'email',
          client: {
            fiscalId: '2222222222',
            erpClientId: '500322361',
          },
        },
      ],
    ]);
    expect(res.success.mock.calls).toEqual([ [
      user,
      200,
    ] ]);

    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 200,
      data: {
        cpgId: '001',
        countryId: 'AR',
        transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002',
        organizationId: '3043',
        firstName: 'MaxiTest',
        lastName: 'BeltranTest',
        email: 'maxi_andina123456789999@gmail.com',
        cellphone: '+541169853429',
        password: 'Nic@2023',
        fieldSelectedToLogin: 'email',
        client: {
          fiscalId: '2222222222',
          erpClientId: '500322361',
        },
      },
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should return a error, this error is not a handled error.', async () => {
    const event = eventMock;
    const user = userMock;

    const repositories = jest.fn().mockResolvedValue({
      User: { getByUserName: jest.fn().mockRejectedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = { user: { validateFoundUser: jest.fn().mockReturnValue({}) } };

    const accessControl = { getUserAuthorization: jest.fn().mockResolvedValue({}) };

    const res = {
      success: jest.fn((data, status = 200, paginationObjet = null) => ({
        httpStatus: status,
        ok: true,
        code: 200,
        data: user,
      })),
      error: jest.fn().mockReturnValue({
        httpStatus: 404,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const result = await handlerClient({ accessControl, repositories, experts, res }).getUser(event);

    expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([ [] ]);
    const { User, closeConnection } = await repositories();
    expect(accessControl.getUserAuthorization.mock.calls).toEqual([
      [
        'Bearer tokenTest',
        'andres.reynoso@incluit.com',
      ],
    ]);
    expect(User.getByUserName.mock.calls).toEqual([
      [
        'andres.reynoso@incluit.com',
      ],
    ]);
    expect(experts.user.validateFoundUser.mock.calls).toEqual([]);
    expect(res.success.mock.calls).toEqual([]);

    expect(result).toEqual({
      httpStatus: 200,
      ok: true,
      code: 1001,
      errorType: 'Not Found',
      httpStatus: 404,
      message: 'descripcion del error',
    });

    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

});