const handler = require('../lambda');

describe('Lambda Function', () => {
  it('It should create new data in dynamoDB', async () => {
    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'mainTest@gmail.com',
      clientId: 2,
      operationType: 'INSERT',
    };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockReturnValue({}),
        remove: jest.fn().mockReturnValue({}),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devClientUser' });

    const experts = { user: { validateDataSyncClientUser: jest.fn().mockResolvedValue({}) } };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
    };


    const { syncClientUserToDynamoDBService } = handler({ awsRepositories, getTableName, experts, res });
    await syncClientUserToDynamoDBService(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(experts.user.validateDataSyncClientUser.mock.calls).toEqual([
      [
        {
          clientId: 2,
          countryId: 'CL',
          cpgId: '001',
          email: 'mainTest@gmail.com',
          operationType: 'INSERT',
          organizationId: '3043',
        },
      ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'devClientUser',
        {
          clientId: 2,
          email: 'mainTest@gmail.com',
          userClientIdKey: 'mainTest@gmail.com-2',
        },
      ],
    ]);
  });

  it('It should delete data from dynamoDB', async () => {
    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'mainTest@gmail.com',
      clientId: 2,
      operationType: 'DELETE',
    };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockReturnValue({}),
        remove: jest.fn().mockReturnValue({}),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devClientUser' });

    const experts = { user: { validateDataSyncClientUser: jest.fn().mockResolvedValue({}) } };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
    };


    const { syncClientUserToDynamoDBService } = handler({ awsRepositories, getTableName, experts, res });
    await syncClientUserToDynamoDBService(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(experts.user.validateDataSyncClientUser.mock.calls).toEqual([
      [
        {
          clientId: 2,
          countryId: 'CL',
          cpgId: '001',
          email: 'mainTest@gmail.com',
          operationType: 'DELETE',
          organizationId: '3043',
        },
      ],
    ]);
    expect(awsRepositories.Repository.remove.mock.calls).toEqual([
      [
        'devClientUser',
        { userClientIdKey: 'mainTest@gmail.com-2' },
      ],
    ]);
  });

  it('It should return a handled error in case of failure to validate the required parameters.', async () => {
    const event = {
      cpgId: '001',
      countryId: 'CL',
      organizationId: '3043',
      email: 'mainTest@gmail.com',
      clientId: 2,
      operationType: 'INSERT',
    };

    const awsRepositories = {
      Repository: {
        create: jest.fn().mockReturnValue({}),
        remove: jest.fn().mockReturnValue({}),
      },
    };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devClientUser' });

    const experts = {
      user: {
        validateDataSyncClientUser: jest.fn(() => {
          throw {
            customError: true,
            getData: jest.fn().mockReturnValue({
              httpStatus: 400,
              status: 'error',
              code: 100,
              msg: 'validation_server_error',
              type: 'Validation_Error',
            }),
          };
        }),
      },
    };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
    };


    const { syncClientUserToDynamoDBService } = handler({ awsRepositories, getTableName, experts, res });
    await syncClientUserToDynamoDBService(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(experts.user.validateDataSyncClientUser.mock.calls).toEqual([
      [
        {
          clientId: 2,
          countryId: 'CL',
          cpgId: '001',
          email: 'mainTest@gmail.com',
          operationType: 'INSERT',
          organizationId: '3043',
        },
      ],
    ]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
  });

});