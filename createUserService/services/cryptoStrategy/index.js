const passwordOnlyStrategy = require('./passwordOnly');
const defaultStrategy = require('./allUserData');
const getEncryption = require('b2b-encryption');

const services = {
  defaultStrategy,
  passwordOnlyStrategy,
};

const selectStrategy = ({ defaultStrategy, passwordOnlyStrategy }) => strategy => {
  const strategies = {
    B2B: defaultStrategy,
    MCC: passwordOnlyStrategy,
  };
  const encryption = getEncryption(strategy);
  const selectedStrategy = strategies[strategy];
  return new selectedStrategy(encryption);
};

module.exports = selectStrategy(services);