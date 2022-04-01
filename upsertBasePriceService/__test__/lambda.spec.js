const handlerBasePrice = require('../lambda');
const { basePriceMock, eventMock } = require('./__mocks__/basePrice');

describe('UpsetBasePrice Lambda Function', () => {
  it('Should update or create base price', async () => {

    const event = eventMock;

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockResolvedValue(basePriceMock),
        create: jest.fn(),
      },
    };

    const experts = {
      basePrice: { validateUpsertBasePrice: jest.fn().mockReturnValue(undefined) },
      product: { validateExistsResult: jest.fn().mockReturnValue(undefined) },
    };

    const repositories = jest.fn().mockResolvedValue({
      BasePrice: { create: jest.fn().mockResolvedValue({}) },
      PriceList: { getOrCreateByErpId: jest.fn().mockResolvedValue({ priceListId: 5 }) },
      Client: { getByErpIdOrPriceListId: jest.fn() },
      Product: { getByErpId: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),
    });

    const getTableName = jest.fn().mockResolvedValue({
      tableNameError: 'devUpsertBasePriceErrors',
      tableName: 'devBasePriceToUpsert',
    });

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertBasePrice } = handlerBasePrice({ awsRepositories, repositories, getTableName, experts, res });
    await upsertBasePrice(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devBasePriceToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    const { PriceListItem, PriceList, Product, Client, closeConnection } = await repositories();
    expect(PriceList.getOrCreateByErpId.mock.calls).toEqual([
      [
        '111111',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        '222222',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(Client.getByErpIdOrPriceListId.mock.calls).toEqual([
      [
        5,
      ],
      [
        5,
      ],
    ]);
    expect(Product.getByErpId.mock.calls).toEqual([
      [
        'test123',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        'test456',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        'test123',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
      [
        'test456',
        {
          countryId: 'AR',
          cpgId: '001',
          organizationId: '3043',
        },
      ],
    ]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([
      [ {} ],
      [ {} ],
      [ {} ],
      [ {} ],
    ]);
    expect(awsRepositories.Repository.create).toHaveBeenCalled();
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });

  it('It should handle an error because an asynchronous task cannot be completed.', async () => {
    const event = eventMock;

    const awsRepositories = {
      Repository: {
        get: jest.fn().mockRejectedValue({ ok: false }),
        create: jest.fn(),
      },
    };

    const experts = {
      basePrice: { validateUpsertBasePrice: jest.fn().mockReturnValue(undefined) },
      product: { validateExistsResult: jest.fn().mockReturnValue(undefined) },
    };

    const repositories = jest.fn().mockResolvedValue({
      BasePrice: { create: jest.fn().mockResolvedValue({}) },
      PriceList: { getOrCreateByErpId: jest.fn().mockResolvedValue({ priceListId: 5 }) },
      Client: { getByErpIdOrPriceListId: jest.fn() },
      Product: { getByErpId: jest.fn().mockResolvedValue({}) },
      closeConnection: jest.fn().mockResolvedValue({}),

    });

    const getTableName = jest.fn().mockResolvedValue({
      tableNameError: 'devUpsertBasePriceErrors',
      tableName: 'devBasePriceToUpsert',
    });

    const res = {
      sendStatus: jest.fn().mockResolvedValue({ httpStatus: 201 }),
      error: jest.fn((message = '', code = 0, errorType = 'Internal_Server_Error', status = 500) => ({
        httpStatus: status,
        ok: false,
        code,
        errorType,
        message,
      })),
    };

    const { upsertBasePrice } = handlerBasePrice({ awsRepositories, repositories, getTableName, experts, res });
    await upsertBasePrice(event);

    expect(getTableName.mock.calls).toEqual([ [] ]);
    expect(repositories.mock.calls).toEqual([ [] ]);
    expect(awsRepositories.Repository.get.mock.calls).toEqual([
      [
        'devBasePriceToUpsert',
        { transactionId: '16fefcc2-28e3-11eb-adc1-0242ac120002' },
      ],
    ]);
    const { PriceListItem, PriceList, Product, Client, closeConnection } = await repositories();
    expect(PriceList.getOrCreateByErpId.mock.calls).toEqual([]);
    expect(Client.getByErpIdOrPriceListId.mock.calls).toEqual([]);
    expect(Product.getByErpId.mock.calls).toEqual([]);
    expect(experts.product.validateExistsResult.mock.calls).toEqual([]);
    expect(awsRepositories.Repository.create.mock.calls).toEqual([]);
    expect(closeConnection.mock.calls).toEqual([ [] ]);
  });
});