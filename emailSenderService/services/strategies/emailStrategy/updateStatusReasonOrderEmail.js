module.exports = ({ templateParser, subjectParser, statusTranslate }) => ({

  /** Set the data in the template and in the subject.
     * @param  {string} message - Email body.
     * @param  {string} subject - Email subject.
     * @param  {object} templateData - Data to set in the template.
     * @returns {object} - Returns the body of the email and the subject of the email with the values set.
     */
  set: ({ message, subject, templateData }) => {

    // Translate the received status to a status for notification.
    const translatedStatus = statusTranslate(templateData);

    // Modify the original status of the order.
    templateData.status = translatedStatus;

    // Makes a parse of the template to set the data.
    const templateParsedMessage = templateParser.templateUpdateStatusReasonParser(message, templateData);

    // Makes a parse of the subject to set the data.
    const subjectParsedMessage = subjectParser.subjectUpdateStatusParser(subject, templateData);

    // Returns a template and a subject with the configured data.
    return {
      templateParsedMessage,
      subjectParsedMessage,
    };

  },
});