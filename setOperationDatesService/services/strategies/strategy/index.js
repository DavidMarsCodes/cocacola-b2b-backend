const create = require('./create');
const update = require('./update');

const api = require('./api');

const strategyService = { create, update };

const selectStrategy = ({ create, update }) => opdates => {

  const strategies = {
    create,
    update,
  };

  const strategy = opdates ? 'update' : 'create';

  const selectedStrategy = strategies[strategy];

  return api(selectedStrategy);
};

module.exports = selectStrategy(strategyService);