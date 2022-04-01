const handlerClientCredit = require('../lambda');
const { resMock, creditLimitMock } = require('./__mocks__/clientCredit');

describe('GetClientCredit Lamda Function', () => {
  it('Request for customer credit data.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      clientId: 1,
      offset: 0,
      limit: 100,
      b2bSession: { Authorization: 'Bearer eyJraWQiOiJwSjluSEkycVpvSStKeVdhZklBcXB3bEl6NkRJSTV3dVRBXC9GSnZ0N1hBQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmZDkzMGQxNS1mY2JmLTRjMWQtOGI0My04ZWY3N2YxN2Y5YTYiLCJhdWQiOiIxZmZuc3VubzQ4Y3F0cTUydjZlOWJyYXRtOCIsImV2ZW50X2lkIjoiOTEzMjE4YTEtMTlkNi00MWQ1LWJiOTctMThjZjc4NmQ0YzczIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjUxNjM5MzEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzBlck1ObnVqRiIsImNvZ25pdG86dXNlcm5hbWUiOiJmZDkzMGQxNS1mY2JmLTRjMWQtOGI0My04ZWY3N2YxN2Y5YTYiLCJleHAiOjE2MjUxNjc1MzEsImlhdCI6MTYyNTE2MzkzMSwiZW1haWwiOiJYMzg2NzJAY29jYS1jb2xhLmNvbSJ9.h_pBHubdt8fPZD9idyuKJIpg4jb-eB1F2WcJF07zQfRKdbuYYI_EQDMsRnBs-FCkzzU9d8_c5dHdwt2ylKvnwQ605_n9v-hVdOJ1K2Qy46Z8GcnuyUuCCR1754_j3v6jXW2QaktXBHR0tiQRkqAfbzJzQaw6KxFWnaiFer7RSbP3xWfUBXk9YeiW6LOjtWk42UFLBe7n7zk6hfTI6LaI6t0k5mNw8NT76sj3aaG1FZLvStzB1pIMTSj8q8oj4-Wvky0-fJKYADaAAkaGqGOAeiA7ioNxvYR7e90qsHV5oy4T5T7590PFwqOibwGz-NtnQvUvHm9dC_UAe7Xomkygsg' },
    };

    const repositories = jest.fn().mockResolvedValue({
      CreditLimit: { getAll: jest.fn().mockResolvedValue({ creditLimitMock }) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const experts = {
      clientCredit: {
        validatePaginationParams: jest.fn().mockReturnValue({
          offset: 0,
          limit: 100,
        }),
        validateClientCreditGetAllRequiredParams: jest.fn(),
        validateExistsResult: jest.fn(),
      },
    };

    const accessControl = { getAuthorization: jest.fn().mockResolvedValue(true) };

    const creditLimitInfo = [
      {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        clientId: 1,
        creditLimit: '100000000.000',
        available: '900.000',
        currency: 'CLP',
        Segment: { segmentId: 1, name: 'NART ' },
        expensed: 99999100,
      },
      {
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        clientId: 1,
        creditLimit: '100000000.000',
        available: '90000000.000',
        currency: 'CLP',
        Segment: { segmentId: 2, name: 'ALCOHOLES' },
        expensed: 10000000,
      },
    ];

    const res = {
      success: jest.fn((clientCredit = creditLimitInfo, status = 200) => ({ resMock })).mockReturnValue({ resMock }),
      error: jest.fn(),
    };

    const result = await handlerClientCredit({ accessControl, repositories, experts, res }).getClientCredit(event);

    // expect(result).toBeTruthy();
    expect(repositories.mock.calls).toEqual([
      [],
    ]);
    expect(experts.clientCredit.validateClientCreditGetAllRequiredParams.mock.calls).toEqual([
      [ {
        transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
        cpgId: '001',
        countryId: 'CL',
        organizationId: '3043',
        clientId: 1,
        offset: 0,
        limit: 100,
        b2bSession: { Authorization: 'Bearer eyJraWQiOiJwSjluSEkycVpvSStKeVdhZklBcXB3bEl6NkRJSTV3dVRBXC9GSnZ0N1hBQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmZDkzMGQxNS1mY2JmLTRjMWQtOGI0My04ZWY3N2YxN2Y5YTYiLCJhdWQiOiIxZmZuc3VubzQ4Y3F0cTUydjZlOWJyYXRtOCIsImV2ZW50X2lkIjoiOTEzMjE4YTEtMTlkNi00MWQ1LWJiOTctMThjZjc4NmQ0YzczIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjUxNjM5MzEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzBlck1ObnVqRiIsImNvZ25pdG86dXNlcm5hbWUiOiJmZDkzMGQxNS1mY2JmLTRjMWQtOGI0My04ZWY3N2YxN2Y5YTYiLCJleHAiOjE2MjUxNjc1MzEsImlhdCI6MTYyNTE2MzkzMSwiZW1haWwiOiJYMzg2NzJAY29jYS1jb2xhLmNvbSJ9.h_pBHubdt8fPZD9idyuKJIpg4jb-eB1F2WcJF07zQfRKdbuYYI_EQDMsRnBs-FCkzzU9d8_c5dHdwt2ylKvnwQ605_n9v-hVdOJ1K2Qy46Z8GcnuyUuCCR1754_j3v6jXW2QaktXBHR0tiQRkqAfbzJzQaw6KxFWnaiFer7RSbP3xWfUBXk9YeiW6LOjtWk42UFLBe7n7zk6hfTI6LaI6t0k5mNw8NT76sj3aaG1FZLvStzB1pIMTSj8q8oj4-Wvky0-fJKYADaAAkaGqGOAeiA7ioNxvYR7e90qsHV5oy4T5T7590PFwqOibwGz-NtnQvUvHm9dC_UAe7Xomkygsg' },
      } ],
    ]);

    expect(experts.clientCredit.validateExistsResult.mock.calls).toEqual([
      [
        result.clientCredits,
      ],
    ]);

    expect(result).toEqual({ resMock });
    const { closeConnection } = await repositories();
    expect(closeConnection.mock.calls).toEqual([ [] ]);

  });
});