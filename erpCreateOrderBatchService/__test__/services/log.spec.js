const log = require('../../services/log');

describe('Create Function', () => {

  it('You should create a log with status OK.', async () => {

    const OrderLog = { create: jest.fn().mockResolvedValue(true) };

    const order = {
      cpgId: '001',
      organizationId: '3043',
      countryId: 'AR',
      orderId: 16,
    };

    const event = 'OK';

    await log.create(OrderLog, order, event);

    expect(OrderLog.create.mock.calls).toMatchSnapshot([
      [
        {
          cpgId: '001',
          eventDatetime: expect.any(String),
          organizationId: '3043',
          countryId: 'AR',
          eventType: 'RETRY',
          eventResult: 'OK',
          eventInfo: `The operation has been successful. The order data was sent with id 16.`,
          orderId: 16,
        },
      ],
    ]);

  });

  it('You should create a log with status ERROR.', async () => {

    const OrderLog = { create: jest.fn().mockResolvedValue(true) };

    const order = {
      cpgId: '001',
      organizationId: '3043',
      countryId: 'AR',
      orderId: 16,
    };

    const error = { message: 'Test Error' };

    const event = 'ERROR';

    await log.create(OrderLog, order, event, error);

    expect(OrderLog.create.mock.calls).toMatchSnapshot([
      [
        {
          cpgId: '001',
          eventDatetime: expect.any(String),
          organizationId: '3043',
          countryId: 'AR',
          eventType: 'RETRY',
          eventResult: 'ERROR',
          eventInfo: 'Test Error',
          orderId: 16,
        },
      ],
    ]);

  });

  it('You should create a log with status ERROR and the message property must contain an empty value in case it is not an axios error.', async () => {

    const OrderLog = { create: jest.fn().mockResolvedValue(true) };

    const order = {
      cpgId: '001',
      organizationId: '3043',
      countryId: 'AR',
      orderId: 16,
    };

    const error = { message: 'Test Error' };

    const event = 'ERROR';

    await log.create(OrderLog, order, event);

    expect(OrderLog.create.mock.calls).toMatchSnapshot([
      [
        {
          cpgId: '001',
          eventDatetime: expect.any(String),
          organizationId: '3043',
          countryId: 'AR',
          eventType: 'RETRY',
          eventResult: 'ERROR',
          eventInfo: '',
          orderId: 16,
        },
      ],
    ]);

  });

});