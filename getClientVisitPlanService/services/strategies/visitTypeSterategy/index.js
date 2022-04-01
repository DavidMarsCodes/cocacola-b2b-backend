// Import services
const services = require('../../index');

// Import the strategies and inject the dependencies.
const deliveryStrategy = require('./delivery')(services);
const othersStrategy = require('./others')(services);

// Import Constants VisitTypes
const visitTypes = require('../../constants/visitTypes');


// We create the strategies as services.
const servicesStrategies = {
  deliveryStrategy,
  othersStrategy,
};

// Import application programming interface.
const api = require('./api');

/** It allows to evaluate and select the strategy to be executed.
 * @param  {object} newOrderEmailStrategy - Sets the sending of an order creation notification.
 * @param  {object} updateStatusOrderEmailStrategy - Sets the sending of a notification due to a change in the status of an order.
 * @param  {string} => strategy - Strategy to select.
 * @returns {object} - Returns an object with the selected strategy.
 */
const selectStrategy = ({ deliveryStrategy, othersStrategy }, visitTypes) => visitType => {

  const strategy = visitTypes.DELIVERY === visitType.toLowerCase() ? visitTypes.DELIVERY : visitTypes.OTHERS;

  const strategies = {
    delivery: deliveryStrategy,
    others: othersStrategy,
  };

  const selectedStrategy = strategies[strategy];
  return api(selectedStrategy);
};


module.exports = selectStrategy(servicesStrategies, visitTypes);
