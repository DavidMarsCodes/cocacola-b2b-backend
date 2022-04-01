module.exports = ({ getSecretEncryptionKey, awsRepositories, tableName, getEncryption, Amplify, handlerErrorCode, experts, ses, res, getSourceEmail, getUrlAws }) => ({

  updatePassword: async event => {
    try {
      // Clone request data.
      const data = { ...event };

      // Validate required parameters
      experts.user.validateUpdatePasswordUserData(data);

      // Get key to decrypt data.
      const { key } = await getSecretEncryptionKey();

      // Decrypt data.
      const encryptedData = {
        password: data.password,
        code: data.code,
        username: data.username,
      };
      console.log(data);
      const { username, code, password } = getEncryption('B2B').decryptAll(encryptedData, key);

      // Validate required data.
      experts.user.validatePasswordFormat({ password });
      experts.user.validateUserNameFormat({ username });
      experts.user.validateCodeFormat({ code });

      // Update password.
      const amplify = await Amplify.init();
      await amplify.Auth.forgotPasswordSubmit(username, code, password);

      // Instantiate the repositories
      const { Repository } = awsRepositories;

      // Get email template
      const dynamoDb = await Repository.get(tableName, { templateName: 'restorePasswordAdvice_email_template' });

      // Extract the information for the template.
      const { subject, message } = dynamoDb.Item;

      // Get the source email.
      const emailSource = await getSourceEmail();

      // Get url from dynamoConfig
      const urlAws = await getUrlAws();

      // TODO unir esto con el de la lambda emailSenderService y pasarlo a un package
      // parse message template
      const parsedMessage = message.replace('${urlAws}', urlAws);

      // Send Email
      await ses.sendEmail(emailSource, username, subject, parsedMessage);

      return res.sendStatus(200);

    } catch (e) {
      console.error(e);

      if (e.customError) {
        let error = e.getData();
        error = handlerErrorCode.resetCode(error);
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      if (e.name) {
        const error = handlerErrorCode.resetCode(e);
        return res.error(error.message, error.code, error.name, 400);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    }
  },

});