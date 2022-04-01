module.exports = ({ repositories, experts, res }) => ({

  getUserNameService: async event => {
    let User;
    let closeConnection;

    try {
      ({ User, closeConnection } = await repositories());
      const userName = await User.getUserNameByEmailOrPhone(event.data);
      experts.user.validateFoundUser(userName);
      return res.success(userName, 200);

    } catch (e) {
      console.error(e);
      if (!e.customError)
        return res.error('internal_server_error', 0, 'server_error', 500);

      const err = e.getData();
      return res.error(err.msg, err.code, err.type, err.httpStatus);
    } finally {
      await closeConnection();
    }
  },
});
