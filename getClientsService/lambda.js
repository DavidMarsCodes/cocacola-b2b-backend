module.exports = ({ repositories, experts, res }) => ({

  getClients: async event => {
    let Client;
    let closeConnection;

    try {
      ({ Client, closeConnection } = await repositories());
      const { cpgId, countryId } = experts.client.validateClientGetAllRequiredParams(event);
      const { offset, limit } = experts.client.validateClientPaginationParams(event.offset, event.limit);

      const data = await Client.getAll(cpgId, countryId, offset, limit);
      experts.client.validateExistsResult(data);

      const pagination = {
        limit,
        offset,
        count: data.count,
        currentPage: data.currentPage,
      };

      return res.success(data.clients, 200, pagination);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },

});