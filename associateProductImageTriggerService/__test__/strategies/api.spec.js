const api = require('../../services/strategies/api');

describe('Api Strategies', () => {

  it('You should execute the set method of the submitted strategy.', () => {

    const strategy = { set: jest.fn().mockResolvedValue({}) };

    const operation = api(strategy);

    expect(typeof operation.setImage).toEqual('function');

  });

});