const readData = async (event, params, connection, elasticSearchRepositories, Query) => {
  try {
    const productIdList = [];

    event.items.forEach(item => {
      productIdList.push(item.productId);
    });

    params.productIdList = productIdList;

    const elasticClient = await connection.initElasticSearchConnection();
    const { Read } = elasticSearchRepositories;
    const search = new Read(elasticClient);
    const query = new Query(event);
    const searchQuery = query.build(params);

    const result = await search.get(`${process.env.ENVIRONMENT.toLowerCase()}-portfolio-${params.cpgId}-${params.organizationId}-${params.countryId.toLowerCase()}`, searchQuery);

    const partialResult = result.hits.hits;

    return { partialResult, portfolioPriceIdList: productIdList };
  } catch (e) {
    console.error(e);
  }
};

module.exports = readData;