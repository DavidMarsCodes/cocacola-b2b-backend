const { statesEnabledNotification } = require('./constants/statusTypes');

/** Validate that the received status is within the status enabled to receive notifications.
 * @param  {object} statesEnabledNotification - States enabled to receive notifications.
 * @param  {object} => templateData - Data to set in the template.
 * @returns {function} -  It function that validates if the received status is within the list of enabled states.
 */
const apiValidationStatesEnabledNotification = statesEnabledNotification => templateData => {

  const status = templateData.status.toUpperCase();
  const statusEnabled = statesEnabledNotification[status];

  if (!statusEnabled) return false;

  return true;
};

const statesEnabled = apiValidationStatesEnabledNotification(statesEnabledNotification);

module.exports = { statesEnabled };