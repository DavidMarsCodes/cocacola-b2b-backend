const discounts = require('./setDiscountImage');
const products = require('./setProductImage');
const api = require('./api');

const services = {
  discounts,
  products,
};

const selectStrategyForOperation = ({ discounts, products }) => strategy => {
  const strategies = {
    discounts,
    products,
  };

  const selectedStrategy = strategies[strategy];

  return api(selectedStrategy);
};

const selectModelForOperation = (strategy, Discounts, Products) => {
  const strategies = {
    discounts: Discounts,
    products: Products,
  };

  const selectedModel = strategies[strategy];

  return selectedModel;
};

const selectOperation = selectStrategyForOperation(services);

module.exports = {
  selectOperation,
  selectModelForOperation,
};