// Import services
const services = require('../../index');

// Import the strategies and inject the dependencies.
const newOrderEmailStrategy = require('./newOrderEmail')(services);
const updateStatusOrderEmailStrategy = require('./updateStatusOrderEmail')(services);
const updateStatusReasonOrderEmailStrategy = require('./updateStatusReasonOrderEmail')(services);

// We create the strategies as services.
const servicesStrategies = {
  newOrderEmailStrategy,
  updateStatusOrderEmailStrategy,
  updateStatusReasonOrderEmailStrategy,
};

// Import application programming interface.
const api = require('./api');


/** It allows to evaluate and select the strategy to be executed.
 * @param  {object} newOrderEmailStrategy - Sets the sending of an order creation notification.
 * @param  {object} updateStatusOrderEmailStrategy - Sets the sending of a notification due to a change in the status of an order.
 * @param  {string} => strategy - Strategy to select.
 * @returns {object} - Returns an object with the selected strategy.
 */
const selectStrategy = ({ newOrderEmailStrategy, updateStatusOrderEmailStrategy, updateStatusReasonOrderEmailStrategy }) => templateNameSelected => {

  const strategy = templateNameSelected.replace('{cpgId}_{countryId}_', '');

  const strategies = {
    newOrder_email_template: newOrderEmailStrategy,
    tracking_email_template: updateStatusOrderEmailStrategy,
    tracking_email_template_reason: updateStatusReasonOrderEmailStrategy,
  };

  const selectedStrategy = strategies[strategy];
  return api(selectedStrategy);
};


module.exports = selectStrategy(servicesStrategies);
