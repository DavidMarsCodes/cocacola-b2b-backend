/** It parses the subject of the email.
 * @param  {string} subject - Email subject.
 * @param  {object} templateData - Data to set in the template.
 * @returns {string} - Returns the subject of the email with the values set.
 */
const subjectUpdateStatusParser = (subject, templateData) => {
  const { orderId, name, status, erpClientId } = templateData;

  subject = subject.replace('${orderId}', orderId);
  subject = subject.replace('${name}', name);
  subject = subject.replace('${status}', status);
  subject = subject.replace('${erpClientId}', erpClientId);

  return subject;
};

/** It parses the subject of the email.
 * @param  {string} subject - Email subject.
 * @param  {object} templateData - Data to set in the template.
 * @returns {string} - Returns the subject of the email with the values set.
 */
const subjectNewOrderParser = (subject, templateData) => {
  const { orderId, erpClientId } = templateData;

  subject = subject.replace('${orderId}', orderId);
  subject = subject.replace('${erpClientId}', erpClientId);

  return subject;
};

module.exports = {
  subjectUpdateStatusParser,
  subjectNewOrderParser,
};