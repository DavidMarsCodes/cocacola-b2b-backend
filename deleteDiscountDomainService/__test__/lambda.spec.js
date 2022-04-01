const handler = require('../lambda');

describe('Delete Discount Lambda Function', () => {

  it('You should delete a discount in the dynamoDB database.', async () => {

    const event = {
      cpg: expect.any(String),
      countryId: expect.any(String),
      organizationId: expect.any(String),
    };

    const experts = { discount: { validateDiscountDiscretionaryGetAllRequiredParams: jest.fn() } };

    const repositories = jest.fn().mockResolvedValue({ closeConnection: jest.fn().mockResolvedValue({}) });

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 500,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const awsRepositories = {
      Repository: {
        query: jest.fn().mockResolvedValue({ ok: true }),
        batchRemove: jest.fn().mockResolvedValue({ ok: true }),
      },
    };

    const getTableNames = jest.fn().mockResolvedValue({ tableName: 'devDiscountDomainModel' });

    const builder = { buidSortKeyTableDiscountDomainModel: jest.fn().mockReturnValue(expect.any(String)) };

    const { deleteDiscountDomainService } = handler({ experts, repositories, res, awsRepositories, getTableNames, builder });

    await deleteDiscountDomainService(event);

    const { closeConnection } = await repositories();

    expect(experts.discount.validateDiscountDiscretionaryGetAllRequiredParams.mock.calls).toMatchSnapshot([
      [
        event,
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([[]]);

  });


  it('It should answer a validation error in case any of the required parameters are invalid.', async () => {

    const event = {
      cpg: expect.any(String),
      countryId: expect.any(String),
      // organizationId: expect.any(String),
    };

    const experts = {
      discount: {
        validateDiscountDiscretionaryGetAllRequiredParams: jest.fn((data) => {
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

    const repositories = jest.fn().mockResolvedValue({ closeConnection: jest.fn().mockResolvedValue({}) });

    const res = {
      sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }),
      error: jest.fn().mockResolvedValue({
        httpStatus: 500,
        ok: true,
        code: 1001,
        errorType: 'Not Found',
        message: 'descripcion del error',
      }),
    };

    const awsRepositories = {
      Repository: {
        query: jest.fn().mockResolvedValue({ ok: true }),
        batchRemove: jest.fn().mockResolvedValue({ ok: true }),
      },
    };

    const getTableNames = jest.fn().mockResolvedValue({ tableName: 'devDiscountDomainModel' });

    const builder = { buidSortKeyTableDiscountDomainModel: jest.fn().mockReturnValue(expect.any(String)) };

    const { deleteDiscountDomainService } = handler({ experts, repositories, res, awsRepositories, getTableNames, builder });

    await deleteDiscountDomainService(event);

    expect(getTableNames.mock.calls).toEqual([]);

    const { closeConnection } = await repositories();

    expect(awsRepositories.Repository.query.mock.calls).toEqual([]);

    expect(awsRepositories.Repository.batchRemove.mock.calls).toEqual([]);

    expect(res.sendStatus.mock.calls).toEqual([]);

    expect(res.error.mock.calls).toEqual([
      [
        'Validation_server_error',
        100,
        'Validation_error',
        400,

      ],
    ]);

    expect(closeConnection.mock.calls).toEqual([[]]);

  });

});