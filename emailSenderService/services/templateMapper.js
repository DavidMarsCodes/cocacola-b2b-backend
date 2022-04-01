/** It parses the body of the email.
 * @param  {string} template - Email body.
 * @param  {object} templateData - Data to set in the template.
 * @returns {string} - Returns the body of the email with the values set.
 */
 const templateUpdateStatusParser = (template, { orderId, name, status, urlAws, clientId, amount, streetAndNumber, deliveryDate }) => {
  const inputChecked = '<img src="${urlAws}/assets/icons/checkboxOK.jpeg" alt="" width="34" height="34">';
  const inputUchecked = '<img src="${urlAws}/assets/icons/checkboxOFF.jpeg" alt="" width="34" height="34">';

  return template.replace('${orderId}', orderId)
    .replace('${name}', name)
    .replace('${status}', status)
    .replace('${clientId}', clientId)
    .replace('${amount}', amount)
    .replace('${streetAndNumber}', streetAndNumber)
    .replace('${deliveryDate}', deliveryDate)
    .replace('${Initiated}', status === 'Ingresado' ? inputChecked : inputUchecked)
    .replace('${Transit}', status === 'En tránsito' ? inputChecked : inputUchecked)
    .replace('${Delivered}', status === 'Entregado' ? inputChecked : inputUchecked)
    .split('${urlAws}')
    .join(urlAws);
};

/** It parses the body of the email.
 * @param  {string} template - Email body.
 * @param  {object} templateData - Data to set in the template.
 * @returns {string} - Returns the body of the email with the values set.
 */
const templateUpdateStatusReasonParser = (template, { orderId, name, status, reason, urlAws, clientId }) => template.replace('${orderId}', orderId)
  .replace('${name}', name)
  .replace('${status}', status)
  .replace('${reason}', reason)
  .replace('${clientId}', clientId)
  .split('${urlAws}')
  .join(urlAws);

/** It parses the body of the email.
 * @param  {string} template - Email body.
 * @param  {object} templateData - Data to set in the template.
 * @returns {string} - Returns the body of the email with the values set.
 */
const templateNewOrderParser = (template, { orderId, name, amount, urlAws, clientId, streetAndNumber, deliveryDate }) => template.replace('${orderId}', orderId)
  .replace('${name}', name)
  .replace('${amount}', amount)
  .replace('${clientId}', clientId)
  .replace('${streetAndNumber}', streetAndNumber)
  .replace('${deliveryDate}', deliveryDate)
  .split('${urlAws}')
  .join(urlAws);


/** Add parameters to the template name.
 * @param  {string} templateName
 * @param  {object} orderData
 */
const templateNameParser = (templateName, { cpgId, countryId, urlAws }) => templateName.replace('{cpgId}', cpgId)
  .replace('{countryId}', countryId);


module.exports = {
  templateNameParser,
  templateNewOrderParser,
  templateUpdateStatusParser,
  templateUpdateStatusReasonParser,
};