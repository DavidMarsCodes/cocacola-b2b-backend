module.exports = ({ accessControl, repositories, experts, res }) => ({

  getClient: async event => {
    let Client;
    let closeConnection;

    try {
      ({ Client, closeConnection } = await repositories());
      let data = {};
      const { cpgId, countryId, organizationId } = experts.client.validateClientGetByIdRequiredParams(event);
      const byErpId = experts.client.validateClientByIdParams(event.clientId, event.erpClientId);

      if (byErpId)
        data = await Client.getByErpId(event.erpClientId, { cpgId, organizationId, countryId });
      else
        data = await Client.getById(event.clientId);

      experts.client.validateExistsResult(data);
      await accessControl.getAuthorization(event.b2bSession.Authorization, data.client.clientId);

      data.client.transactionId = event.transactionId;
      return res.success(data.client, 200);
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