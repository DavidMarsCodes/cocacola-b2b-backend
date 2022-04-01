module.exports = ({ repositories, experts, res }) => ({

  getPortfolio: async event => {
    try {

      const { Portfolio } = await repositories();
      const { offset, limit } = experts.portfolio.validatePortfolioPaginationParams(event.offset, event.limit);
      experts.portfolio.validatePortfolioGetAllRequiredParams(event);
      experts.portfolio.isValidDate(event.deliverydate);

      const data = await Portfolio.getAll(offset, limit, event.cpgId, event.countryId, event.organizationId, event.clientId, event.deliverydate);

      const pagination = {
        limit,
        offset,
        count: data.count,
        currentPage: data.currentPage,
      };

      experts.portfolio.validateExistsResult(data.portfolio);

      return res.success(data.portfolio, 200, pagination);

    } catch (error) {
      console.error(error);
      if (error.customError) {
        const err = error.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    }
  },
});
