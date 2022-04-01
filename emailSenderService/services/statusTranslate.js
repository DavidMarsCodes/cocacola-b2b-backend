const { statesEnabledNotification } = require('./constants/statusTypes');

/** Translates the received status to a status for notification.
 * @param  {object} statesEnabledNotification - States enabled to receive notifications.
 * @param  {object} => templateData - Data to set in the template.
 * @returns {function} - It function that allows to perform the translation of the state for the notification.
 */
const apiStatusTranslate = statesEnabledNotification => templateData => {

  const status = templateData.status.toUpperCase();

  const statusTranslate = statesEnabledNotification[status];

  return statusTranslate;
};

module.exports = apiStatusTranslate(statesEnabledNotification);