
module.exports = ({ accessControl, experts, dbRedis, elasticSearchRepositories, connection, Query, getElasticSearchIndex, environment, Mapper, res }) => ({

  /** Elasitcsearch filter in client portfolio.
     * @param  {object} event
     * @returns {object} portfolioDto paginated
     */
  getElasticSearchPortfolio: async (event) => {
    try {
      // Input parameter validations
      experts.portfolio.validatePortfolioGetAllRequiredParams(event);
      // Control if the user is authorized to access the resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      // Generate a copy of the received data.
      const data = { ...event };

      // Validate pagination parameters
      const { offset, limit } = experts.portfolio.validatePortfolioPaginationParams(data.offset, data.limit);

      // Get session username.
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      // Initialize the Redis repository.
      const redis = await dbRedis();

      // Get date from Redis.
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `No 'Operation Dates' were found for user: ${userName}` });
      const priceDateByCountry = operationDates.pricesDate;

      // Cerrar conexión a Redis
      redis.closeConnection();

      // Initialize the ElasticSearch repository.
      const elasticClient = await connection.initElasticSearchConnection();
      const { Read } = elasticSearchRepositories;
      const search = new Read(elasticClient);

      // Generate an instance of our query object.
      const query = new Query();

      // Build the query according to the received parameters.
      const searchQuery = query
        .setPagination(offset, limit)
        .setRange(priceDateByCountry)
        .setTerm(data)
        .setFullText(data.text)
        .setSort()
        .build();

      // Get index elasticSearch
      const index = await getElasticSearchIndex();

      // Build the index name based on the execution environment.
      const elasticSearchIndex = `${environment}-${index}-${event.cpgId.toLowerCase()}-${event.organizationId.toLowerCase()}-${event.countryId.toLowerCase()}`;

      // Get the data from the elasticSearch engine.
      const portfolio = await search.get(elasticSearchIndex, searchQuery);

      // Build portfolio DTO.
      const portfolioDto = Mapper.portfolioMap(portfolio);

      // Set pagination
      const pagination = {
        offset,
        limit,
        count: portfolio.hits.total.value,
        currentpage: Math.ceil(offset / limit) + 1,
      };

      // Response
      return res.success(portfolioDto, 200, pagination);

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
