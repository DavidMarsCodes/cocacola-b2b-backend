const createStrategy = require('./create');
const defaultStrategy = require('./default');
const api = require('./api');

const services = {
  createStrategy,
  defaultStrategy,
};

const selectStrategy = ({ createStrategy, defaultStrategy }) => (strategy) => {
  const defineStrategy = strategy ? 'default' : 'create';
  const strategies = {
    create: createStrategy,
    default: defaultStrategy,
  };

  const selectedStrategy = strategies[defineStrategy];
  return api(selectedStrategy);
};

module.exports = selectStrategy(services);
