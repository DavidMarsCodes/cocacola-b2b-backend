const errEvent = require('../../services/error.handler');

describe('Handler Function', () => {

  it('It should return an error of type OTHER in case of receiving a code that is not valid.', () => {

    const err = {
      toJSON: jest.fn().mockReturnValue('Handler Error'),
      code: 'DONTEXISTINGCODE',
      message: 'Test error',
    };

    const order = { orderId: 16 };

    const result = errEvent.handler(err, order);

    expect(result).toEqual({
      meta: 'Handler Error',
      code: 'DONTEXISTINGCODE',
      message: 'Test error',
      orderId: 16,
    });

  });

  it('It should return an error of type TimeOut in case of receiving the code ECONNABORTED.', () => {

    const err = {
      toJSON: jest.fn().mockReturnValue('Handler Error'),
      code: 'ECONNABORTED',
    };

    const order = { orderId: 16 };

    const result = errEvent.handler(err, order);

    expect(result).toEqual({
      code: 'ECONNABORTED',
      timeOut: true,
      message: 'The conection time out expired.',
      meta: 'Handler Error',
      orderId: 16,
    });

  });

});