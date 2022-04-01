const normalStrategy = require('./normalUser');
const adminStrategy = require('./adminUser');
const initCognito = require('./cognito');

const services = {
  normalStrategy,
  adminStrategy,
};

const selectStrategy = ({ normalStrategy, adminStrategy }) => async (sourceChannel, AWS) => {
  const strategies = {
    B2B: normalStrategy,
    MCC: adminStrategy,
  };
  const selectedStrategy = strategies[sourceChannel];
  return await initCognito(sourceChannel, selectedStrategy, AWS);
};

module.exports = selectStrategy(services);