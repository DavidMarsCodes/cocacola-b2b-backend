const handler = require('../lambda');

describe('Lambda Function', () => {
  it('You should save orders in the dynamoDB database.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      data: [ {
        erpOrderId: '200111',
        erpOrderDatetime: '2020-12-31T00:00:00.000Z',
        erpOrderDeliveryDate: '2021-01-04T00:00:00.000Z',
        erpOrderStatus: 'created',
        erpOrderAmount: 1000,
        erpChannelInput: 'SFCoke',
        orderId: null,
        erpDocumentType: 'FC',
        erpPaymentMethod: 'Contado',
        erpShippingInformation: 'no aplica',
      } ],
      createdTime: expect.any(String),
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const experts = { orderHistory: { validatecreateOrderHistory: jest.fn() } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'OrderHistoryToUpsert' });

    const res = { sendStatus: jest.fn().mockReturnValue({ httpStatus: 201 }) };

    const { createOrderHistory } = handler({ awsRepositories, getTableName, experts, res });
    await createOrderHistory(event);

    expect(experts.orderHistory.validatecreateOrderHistory.mock.calls).toMatchSnapshot([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          data: [ {
            erpOrderId: '200111',
            erpOrderDatetime: '2020-12-31T00:00:00.000Z',
            erpOrderDeliveryDate: '2021-01-04T00:00:00.000Z',
            erpOrderStatus: 'created',
            erpOrderAmount: 1000,
            erpChannelInput: 'SFCoke',
            orderId: null,
            erpDocumentType: 'FC',
            erpPaymentMethod: 'Contado',
            erpShippingInformation: 'no aplica',
          } ],
          createdTime: expect.any(String),
        },
      ],
    ]);

    expect(getTableName.mock.calls).toEqual([ [] ]);

    expect(awsRepositories.Repository.create.mock.calls).toMatchSnapshot([
      [
        'OrderHistoryToUpsert',
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          data: [ {
            erpOrderId: '200111',
            erpOrderDatetime: '2020-12-31T00:00:00.000Z',
            erpOrderDeliveryDate: '2021-01-04T00:00:00.000Z',
            erpOrderStatus: 'created',
            erpOrderAmount: 1000,
            erpChannelInput: 'SFCoke',
            orderId: null,
            erpDocumentType: 'FC',
            erpPaymentMethod: 'Contado',
            erpShippingInformation: 'no aplica',
          } ],
          createdTime: expect.any(String),
        },
      ],
    ]);

    expect(res.sendStatus.mock.calls).toEqual([
      [
        201,
      ],
    ]);
  });

  it('It should answer a validation error in case any of the required parameters are invalid.', async () => {

    const event = {
      transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      data: [ {
        erpOrderId: '200111',
        erpOrderDatetime: '2020-12-31T00:00:00.000Z',
        erpOrderDeliveryDate: '2021-01-04T00:00:00.000Z',
        erpOrderStatus: 'created',
        erpOrderAmount: 1000,
        erpChannelInput: 'SFCoke',
        orderId: null,
        erpDocumentType: 'FC',
        erpPaymentMethod: 'Contado',
        erpShippingInformation: 'no aplica',
      } ],
      createdTime: expect.any(String),
    };

    const awsRepositories = { Repository: { create: jest.fn().mockResolvedValue({ ok: true }) } };

    const getTableName = jest.fn().mockResolvedValue({ tableName: 'OrderHistoryToUpsert' });

    const experts = {
      orderHistory: {
        validatecreateOrderHistory: jest.fn(data => {
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

    const { createOrderHistory } = handler({ awsRepositories, getTableName, experts, res });
    await createOrderHistory(event);

    expect(experts.orderHistory.validatecreateOrderHistory.mock.calls).toMatchSnapshot([
      [
        {
          transactionId: '1715ba2d-5b0b-4ba0-883b-c48a0de8a670',
          cpgId: '001',
          countryId: 'AR',
          organizationId: '3043',
          data: [ {
            erpOrderId: '200111',
            erpOrderDatetime: '2020-12-31T00:00:00.000Z',
            erpOrderDeliveryDate: '2021-01-04T00:00:00.000Z',
            erpOrderStatus: 'created',
            erpOrderAmount: 1000,
            erpChannelInput: 'SFCoke',
            orderId: null,
            erpDocumentType: 'FC',
            erpPaymentMethod: 'Contado',
            erpShippingInformation: 'no aplica',
          } ],
          createdTime: expect.any(String),
        },
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

});