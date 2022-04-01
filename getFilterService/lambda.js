module.exports = ({ accessControl, repositories, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getFilter: async event => {
    let Portfolio;
    let closeConnection;

    try {
      ({ Portfolio, closeConnection } = await repositories());

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      experts.portfolio.validationRequiredParamsGetFilter(event);

      const filters = await Portfolio.getFilters(event);

      return res.status(200).json(filters);

    } catch (e) {
      console.error(e);

      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }

      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});
