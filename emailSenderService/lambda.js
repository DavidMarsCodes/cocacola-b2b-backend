module.exports = ({ awsRepositories, experts, builder, validations, selectTemplateNameByStatus, getNameEmailTemplates, templateParser, tableName, getSourceEmail, getUrlAws, strategies, ses, HandlerDates }) => ({

  /** Send notifications via email.
     * @param  {object} event - Data Input.
     */
  emailSender: async event => {

    try {
      // Generate a copy of the received event.
      const orderData = JSON.parse(event.Records[0].body);

      // Information log of the order received
      console.info('Data of the order received: ', orderData);

      // Validate required parameters.
      experts.client.validateEmailRequiredParams(orderData);

      // FIXME it should NOT return todays date when passed undefined as parameter
      // format deliveryDate.
      orderData.deliveryDate = HandlerDates.format(orderData.deliveryDate, 'DD/MM/YYYY');

      // Initialize aws repositories.
      const { Repository } = awsRepositories;

      // Get url from dynamoConfig
      const urlAws = await getUrlAws();

      // Build an order object based on the orederId and erpOrderId parameters received in the request.
      const templateData = builder.buildTemplateData(orderData, urlAws);

      // Validate that the status of the order is enabled to receive notifications.
      const enabledStatus = validations.statesEnabled(templateData);

      if (!enabledStatus) {
        console.warn({
          ...templateData,
          message: `The "${templateData.status}" status is not enabled to send email notifications.`,
        });
        return;
      }

      // Get template names.
      const templates = await getNameEmailTemplates();

      // Evaluate the status of the order to determine which template to use.
      const templateNameSelected = selectTemplateNameByStatus(templateData.status, templates);

      // Map the name of the selected template.
      const templateName = templateParser.templateNameParser(templateNameSelected, orderData);

      // Get template and subject data from the db.
      const dynamoDb = await Repository.get(tableName, { templateName });
      const { subject, message } = dynamoDb.Item;

      // Get source email.
      const emailSource = await getSourceEmail();

      // Evaluate, select and configure the type of email to send.
      const strategy = strategies.emailStrategy(templateNameSelected);

      // Execute the strategy for setting the data for sending the mail.
      const { templateParsedMessage, subjectParsedMessage } = strategy.setOrderEmail({ message, subject, templateData });

      // Send the email.
      await ses.sendEmail(emailSource, orderData.email, subjectParsedMessage, templateParsedMessage);

    } catch (error) {
      console.error(error);
      console.info('EVENT: ', event);
    }
  },

});