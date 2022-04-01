module.exports = ({ accessControl, repositories, experts, res }) => ({
  getUser: async event => {
    let User;
    let closeConnection;

    try {
      ({ User, closeConnection } = await repositories());

      await accessControl.getUserAuthorization(event.b2bSession.Authorization, event.username);

      const user = await User.getByUserName(event.username);

      experts.user.validateFoundUser(user);

      return res.success(user, 200);

    } catch (e) {
      console.error(e);
      console.info('DATA EVENT: ', event);
      if (!e.customError)
        return res.error('internal_server_error', 0, 'server_error', 500);

      const err = e.getData();
      if (err.msg == 'user_not_found') err.code = 2015;
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }
  },

});
