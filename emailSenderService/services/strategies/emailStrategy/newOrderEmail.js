module.exports = ({ templateParser, subjectParser }) => ({

  /** Set the data in the template and in the subject.
     * @param  {string} message - Email body.
     * @param  {string} subject - Email subject.
     * @param  {object} templateData - Data to set in the template.
     * @returns {object} - Returns the body of the email and the subject of the email with the values set.
     */
  set: ({ message, subject, templateData }) => {

    // Makes a parse of the template to set the data.
    const templateParsedMessage = templateParser.templateNewOrderParser(message, templateData);

    // Makes a parse of the subject to set the data.
    const subjectParsedMessage = subjectParser.subjectNewOrderParser(subject, templateData);

    // Returns a template and a subject with the configured data.
    return {
      templateParsedMessage,
      subjectParsedMessage,
    };

  },
});