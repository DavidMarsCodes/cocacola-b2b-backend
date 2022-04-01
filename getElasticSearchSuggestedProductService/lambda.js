const { CodeGuruProfiler } = require('aws-sdk');

module.exports = ({ accessControl, elasticSearchRepositories, connection, dbRedis, experts, Query, environment, getElasticSearchIndex, translate, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getElasticSearchSuggestedProduct: async event => {
    try {
      // Control if the user is authorized to access the resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      // Get session username.
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      // Generate a copy of the received data.
      const data = { ...event };

      // Validate input parameters.
      experts.suggestedProduct.validateSuggestedProductGetAllRequiredParams(data);

      // Validate pagination parameters
      const { offset, limit } = experts.suggestedProduct.validateSuggestedProductPaginationParams(data.offset, data.limit);

      // Initialize the Redis repository.
      const redis = await dbRedis();

      // Get date from Redis.
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });
      const { pricesDate } = operationDates;

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
        .setRange(pricesDate)
        .setTerm(data)
        .setFullText(data.text)
        .setSort()
        .build();

      // Get index elasticSearch
      const index = await getElasticSearchIndex();

      // Build the index name based on the execution environment.
      const elasticSearchIndex = `${environment}-${index}-${event.cpgId.toLowerCase()}-${event.organizationId.toLowerCase()}-${event.countryId.toLowerCase()}`;

      // Get the data from the elasticSearch engine.
      const suggestedProductsData = await search.get(elasticSearchIndex, searchQuery);

      // Translate the answer of the suggested products.
      const suggestedProductsDto = translate.suggestedProducts(suggestedProductsData);

      // Validate if there are suggested products.
      experts.suggestedProduct.hasSuggestedProducts(suggestedProductsDto, 'SUGGESTED_PRODUCT_NOT_FOUND', suggestedProductsData);

      // Set pagination
      const pagination = {
        offset,
        limit,
        count: suggestedProductsData.hits.total.value,
        currentpage: Math.ceil(offset / limit) + 1,
      };

      // Response
      return res.success(suggestedProductsDto, 200, pagination);

    } catch (error) {
      console.log(error);
      if (error.customError) {
        const err = error.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    }
  },
});
