const { templateByState } = require('./constants/statusTypes');

/** Evaluate and select the name of the template to use based on the status received.
 * @param  {string} statusTypeTemplate - Type of states for templates.
 * @param  {string} enabledStates - Enabled states.
 * @param  {string} => statusData - State data.
 * @returns {function} - It function that allows the name of the template to select.
 */
const apiSelectTemplateNameByStatus = templateByState => (statusData, templates) => {
  const status = statusData.toUpperCase();

  const statesAvailableToSelect = {
    REGISTERED: templateByState.CREATED,
    BLOCKED: templateByState.REASON,
    RETURNED: templateByState.REASON,
  };

  const stateAvailableSelected = statesAvailableToSelect[status];

  const templateNameSelected = stateAvailableSelected || templateByState.DEFAULT;

  const templateName = templates[templateNameSelected];
  return templateName;
};

module.exports = apiSelectTemplateNameByStatus(templateByState);