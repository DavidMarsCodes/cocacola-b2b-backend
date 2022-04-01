module.exports = ({ accessControl, dbRedis, getElasticSearchIndex, elasticSearchRepositories, connection, experts, Query, environment, Filter, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getElasticSearchFiltersAndCategories: async event => {
    try {
      // Check if you are authorized to access resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      // Get session username.
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      // Generate a copy of the received data.
      const data = { ...event };

      // Validate input parameters.
      experts.portfolio.validatePortfolioGetLabelRequiredParams(data);
      experts.portfolio.validationRequiredParamsGetFilter(data);

      // Initialize the Redis repository.
      const redis = await dbRedis();
      // Get date from Redis.
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });
      const { pricesDate } = await operationDates;

      // Cerrar conexión a Redis
      redis.closeConnection();

      // Initialize the ElasticSearch repository.
      const elasticClient = await connection.initElasticSearchConnection();
      const { Read } = elasticSearchRepositories;
      const search = new Read(elasticClient);

      // Generate an instance of our query object.
      const queryFilter = new Query();
      const queryCategory = new Query();

      // Build the query according to the received parameters.
      const searchQueryFilter = queryFilter
        .setRange(pricesDate)
        .setTerm(data)
        .setFullText(data.text)
        .setAggsBrand()
        .setAggsSize()
        .setAggsPackages()
        .setAggsReturnability()
        .build();

      const searchQueryCategory = queryCategory
        .setTerm(data)
        .setAggsCategories()
        .build();

      const index = await getElasticSearchIndex();

      // Build the index name based on the execution environment.
      const elasticSearchIndex = `${environment}-${index}-${event.cpgId.toLowerCase()}-${event.organizationId.toLowerCase()}-${event.countryId.toLowerCase()}`;
      // Get the data from the elasticSearch engine.
      const filtersAndCategoriesData = await Promise.all([ search.get(elasticSearchIndex, searchQueryFilter), search.get(elasticSearchIndex, searchQueryCategory) ]);

      const { brands, sizes, packages, returnabilities } = filtersAndCategoriesData[0].aggregations;
      const { categories } = filtersAndCategoriesData[1].aggregations;
      // const { brands, sizes, categories, packages } = filtersAndCategoriesData.aggregations;

      // Translate the answer of the filter and categories.
      const categoriesDtoBuilder = new Filter();
      const filterDtoBuilder = new Filter();

      const categoriesDto = categoriesDtoBuilder
        .categoriesMap(categories.buckets)
        .getFilter();

      const filterDto = filterDtoBuilder
        .brandsMap(brands.buckets)
        .sizesMap(sizes.buckets)
        .packagesMap(packages.buckets)
        .returnabilityMap(returnabilities.buckets)
        .getFilter();


      const filtersAndCategoriesDto = { ...categoriesDto, ...filterDto };

      // Response
      return res.status(200).json(filtersAndCategoriesDto);

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
