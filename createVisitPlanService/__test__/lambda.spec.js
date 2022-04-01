const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should save an order in the dynamoDB database.', async () => {

    const event = { createdTime: expect.any(String) };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'tableName' });

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const experts = { visitPlan: { validatecreateVisitPlan: jest.fn() } };

    const res = { sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }) };

    const { createVisitPlan } = handler({ awsRepositories, experts, getTableName, res });
    await createVisitPlan(event);

    expect(experts.visitPlan.validatecreateVisitPlan.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.create.mock.calls).toMatchSnapshot([
      [
        'tableName',
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

    const event = { createdTime: expect.any(String) };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'tableName' });

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const experts = {
      visitPlan: {
        validatecreateVisitPlan: jest.fn(data => {
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

    const { createVisitPlan } = handler({ awsRepositories, experts, getTableName, res });
    await createVisitPlan(event);

    expect(experts.visitPlan.validatecreateVisitPlan.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([]);

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

    const event = { createdTime: expect.any(String) };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'tableName' });

    const awsRepositories = { Repository: { create: jest.fn().mockRejectedValue({ ok: false }) } };

    const experts = { visitPlan: { validatecreateVisitPlan: jest.fn() } };

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

    const { createVisitPlan } = handler({ awsRepositories, experts, getTableName, res });
    await createVisitPlan(event);

    expect(experts.visitPlan.validatecreateVisitPlan.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.create.mock.calls).toEqual([
      [
        'tableName',
        event,
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Internal Server Error',
        500,
        'Server Error',
        500,
        '{"ok":false}',
      ],
    ]);

  });

});