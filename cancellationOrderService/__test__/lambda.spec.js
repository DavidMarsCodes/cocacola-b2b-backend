const handler = require('../lambda');

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2021-02-18'));
});

describe('Lambda Function', () => {

  it('It should answer a status 201.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      orderId: 10000278,
      clientId: 1,
      b2bSession: {
        Authorization:
          'Bearer eyJraWQiOiJwSjluSEkycVpvSStKeVdhZklBcXB3bEl6NkRJSTV3dVRBXC9GSnZ0N1hBQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5NGQ2ZWJjOS1hZWQ4LTQxZTMtYTQ4My0zYzI1NjJmYjFlOTQiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NDIzNzM0MzY1MTg3OnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8wZXJNTm51akYiLCJjb2duaXRvOnVzZXJuYW1lIjoiOTRkNmViYzktYWVkOC00MWUzLWE0ODMtM2MyNTYyZmIxZTk0IiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6NDIzNzM0MzY1MTg3OnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiXSwiYXVkIjoiNnBicDMxOGhpZ3UxNGRoMzBodWZqOGJlbGwiLCJldmVudF9pZCI6ImNmNGU5MDllLTYyNGMtNGFjYi04MmNjLTY4NWE1NWM4ZDExZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ1ODE0NDgwLCJwaG9uZV9udW1iZXIiOiIrNTY4ODkxMjQ1NTUiLCJleHAiOjE2NDU4MTgwODUsImlhdCI6MTY0NTgxNDQ4NiwiZW1haWwiOiJhZ29zdGluYWFiYXlheUBnbWFpbC5jb20ifQ.cmKSY4sFAt3Kt3xt-JmYydJl-uktNUU9aHfNVKACS-waO8Y-wMHBJXpU8rgLFmmATdWtN6rJN3NXN2p7D8WwnuNqX2wG0vVg9ht9gDq2pkkdRlIvw4Tht8TEtYGptYO0CxErpjjIHJ3BUfZJz-GZB1f_8oMNUYBhhIkHgCprEfthjK_yFhuO4UCxtO48iW3oKHbbU6FQcJXmh8MmUGFFYi3Pkmyqadetd9IgkyM9Wprx1sj6uYxwXYVEGVf-iKVEz6dEz6Y4qhacQblfdtG5JR7E_RZ65hqWQHyBbnXkHmUblAkVs3_iZpll38DVfA-mpVIWjvC-xHy1mb1ZeZvRSQ',
      },
    };

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ email: 'agostinaabayay@gmail.com' }),
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        updateStatus: jest.fn().mockResolvedValue({}),
        getById: jest.fn().mockResolvedValue({ status: 'DELIVERED', erpOrderId: '0204287512' }),
      },
    });

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(),
    };

    const res = { sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }) };

    const experts = { order: { validateIsCancellableOrder: jest.fn() } };

    const { cancellationOrderService } = handler({ accessControl, repositories, experts, getErpConfig, erpManager, res });

    await cancellationOrderService(event);

    expect(getErpConfig.mock.calls).toEqual([[]]);

    expect(erpManager.updateConfig.mock.calls).toEqual([[{}]]);

    expect(erpManager.save.mock.calls).toEqual([[
      {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        orderId: 10000278,
        erpOrderId: '0204287512',
        user: 'agostinaabayay@gmail.com',
        createdAt: expect.any(String),
      },
    ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);

  });

  it('It should return a server_error in case of an unhandled error.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      orderId: 10000278,
      clientId: 1,
      b2bSession: {
        Authorization:
          'Bearer eyJraWQiOiJwSjluSEkycVpvSStKeVdhZklBcXB3bEl6NkRJSTV3dVRBXC9GSnZ0N1hBQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5NGQ2ZWJjOS1hZWQ4LTQxZTMtYTQ4My0zYzI1NjJmYjFlOTQiLCJjb2duaXRvOmdyb3VwcyI6WyJpbnZva2UtYXBpIl0sImNvZ25pdG86cHJlZmVycmVkX3JvbGUiOiJhcm46YXdzOmlhbTo6NDIzNzM0MzY1MTg3OnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8wZXJNTm51akYiLCJjb2duaXRvOnVzZXJuYW1lIjoiOTRkNmViYzktYWVkOC00MWUzLWE0ODMtM2MyNTYyZmIxZTk0IiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6NDIzNzM0MzY1MTg3OnJvbGVcL2lhbV9yX2NvZ25pdG9fc2VjdXJlX2ludm9rZS1hcGkiXSwiYXVkIjoiNnBicDMxOGhpZ3UxNGRoMzBodWZqOGJlbGwiLCJldmVudF9pZCI6ImNmNGU5MDllLTYyNGMtNGFjYi04MmNjLTY4NWE1NWM4ZDExZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ1ODE0NDgwLCJwaG9uZV9udW1iZXIiOiIrNTY4ODkxMjQ1NTUiLCJleHAiOjE2NDU4MTgwODUsImlhdCI6MTY0NTgxNDQ4NiwiZW1haWwiOiJhZ29zdGluYWFiYXlheUBnbWFpbC5jb20ifQ.cmKSY4sFAt3Kt3xt-JmYydJl-uktNUU9aHfNVKACS-waO8Y-wMHBJXpU8rgLFmmATdWtN6rJN3NXN2p7D8WwnuNqX2wG0vVg9ht9gDq2pkkdRlIvw4Tht8TEtYGptYO0CxErpjjIHJ3BUfZJz-GZB1f_8oMNUYBhhIkHgCprEfthjK_yFhuO4UCxtO48iW3oKHbbU6FQcJXmh8MmUGFFYi3Pkmyqadetd9IgkyM9Wprx1sj6uYxwXYVEGVf-iKVEz6dEz6Y4qhacQblfdtG5JR7E_RZ65hqWQHyBbnXkHmUblAkVs3_iZpll38DVfA-mpVIWjvC-xHy1mb1ZeZvRSQ',
      },
    };

    const repositories = jest.fn().mockResolvedValue({
      Order: {
        updateStatus: jest.fn().mockResolvedValue({}),
        getById: jest.fn().mockResolvedValue({ status: 'NOT_DELIVERED', erpOrderId: '0204287512' }),
      },
    });

    const accessControl = {
      getAuthorization: jest.fn().mockResolvedValue(true),
      getSessionData: jest.fn().mockResolvedValue({ email: 'agostinaabayay@gmail.com' }),
    };

    const getErpConfig = jest.fn().mockResolvedValue({});

    const erpManager = {
      updateConfig: jest.fn(),
      save: jest.fn().mockResolvedValue(),
    };

    const res = {
      error: jest.fn((message = '', code = 0, errorType = 'InternalServerError', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
    };

    const experts = {
      order: {
        validateIsCancellableOrder: jest.fn(data => {
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
      }
    };

    const { cancellationOrderService } = handler({ accessControl, repositories, experts, getErpConfig, erpManager, res });

    await cancellationOrderService(event);

    expect(getErpConfig.mock.calls).toEqual([]);

    expect(experts.order.validateIsCancellableOrder.mock.calls).toEqual([['NOT_DELIVERED']]);

    expect(erpManager.updateConfig.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'No orders were found matching failed status or created.',
        100,
        'Validation_error',
        400,
      ],
    ]);

  });

});