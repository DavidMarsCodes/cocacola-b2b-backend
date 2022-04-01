module.exports = ({ getSecretEncryptionKey, getEncryption, Amplify, handlerErrorCode, experts, res, repositories }) => ({

  updatePasswordExternal: async (event) => {
    let User;
    let closeConnection;

    try {
      ({ User, closeConnection } = await repositories());

      // Validate required parameters
      experts.user.validatePasswordRecoveryUser(event);

      // Validate user exists
      const user = await User.getUserByEmailOrPhoneAndTenant(event);
      experts.user.validateFoundUser(user);

      // Get key to decrypt data.
      const { key } = await getSecretEncryptionKey();

      const { oldPassword, newPassword, email } = event;

      // Decrypt data.
      const { oldPassword: decryptedOldPassword, newPassword: decryptedNewPassword } = getEncryption('MCC').decryptAll({ oldPassword, newPassword }, key);

      // Validate required data.
      experts.user.validatePasswordFormat({ password: decryptedNewPassword });

      // Update password.
      const { Auth } = await Amplify.init();
      const singedUser = await Auth.signIn(email, decryptedOldPassword);
      await Auth.changePassword(singedUser, decryptedOldPassword, decryptedNewPassword);

      return res.sendStatus(204);

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
    } finally {
      closeConnection();
    }
  },

});