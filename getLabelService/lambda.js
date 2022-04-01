module.exports = ({ accessControl, repositories, experts, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getLabel: async event => {
    let Portfolio;
    let closeConnection;

    try {
      ({ Portfolio, closeConnection } = await repositories());

      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      experts.portfolio.validatePortfolioGetLabelRequiredParams(event);

      const tags = await Portfolio.getTags(event);

      return res.status(200).json(tags);

    } catch (error) {
      console.error(error);
      if (error.customError) {
        const err = error.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 500, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});
