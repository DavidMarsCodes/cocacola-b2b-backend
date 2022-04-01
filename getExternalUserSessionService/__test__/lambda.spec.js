const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should get record from the dynamoDB database via a "id".', async () => {

    const event = { userId: '16fefcc2-28e3-11eb-adc1-0242ac120002' };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'devExternalUserSession' });

    const awsRepositories = { Repository: { remove: jest.fn().mockResolvedValue({ Attributes: { id: '16fefcc2-28e3-11eb-adc1-0242ac120003' } }) } };

    const experts = { user: { validateFoundUser: jest.fn() } };

    const res = {
      success: jest.fn((data, httpStatus) => ({
        httpStatus,
        ok: true,
        code: httpStatus,
        data,
      })),
    };

    const { getExternalUserSession } = handler({
      awsRepositories,
      getTableName,
      experts,
      res,
    });
    await getExternalUserSession(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.remove.mock.calls).toEqual([
      [
        'devExternalUserSession',
        { id: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);

  });
});