module.exports = ({ accessControl, repositories, experts, res }) => ({

  getClientCredit: async (event) => {
    let CreditLimit;
    let closeConnection;

    try {
      ({ CreditLimit, closeConnection } = await repositories());
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      experts.clientCredit.validateClientCreditGetAllRequiredParams(event);
      const { limit, offset } = await experts.clientCredit.validatePaginationParams(event.offset, event.limit);

      const data = await CreditLimit.getAll(event);

      experts.clientCredit.validateExistsResult(data.creditLimitInfo);

      const pagination = {
        limit,
        offset,
        count: data.count,
        currentPage: data.currentPage,
      };

      return res.success(data.creditLimitInfo, 200, pagination);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      closeConnection();
    }
  },

});