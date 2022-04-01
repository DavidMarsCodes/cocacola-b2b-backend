class Query {

  constructor (event) {
    this.query = {
      size: event.limit,
      from: event.offset,
      query: { bool: { filter: [] } },
    };

  }

  build(params) {

    if (params.countryId && params.countryId !== '')
      this.query.query.bool.filter.push({ term: { countryId: params.countryId } });


    if (params.cpgId && params.cpgId !== '')
      this.query.query.bool.filter.push({ term: { cpgId: params.cpgId } });


    if (params.organizationId && params.organizationId !== '')
      this.query.query.bool.filter.push({ term: { organizationId: params.organizationId } });


    if (params.clientId && params.clientId !== '')
      this.query.query.bool.filter.push({ term: { clientId: params.clientId } });


    if (params.productIdList && params.productIdList.length > 0) {
      this.query.query.bool.filter.push({ terms: { productId: params.productIdList } });
      this.query.size = params.productIdList.length;
    }

    if (params.deliverydate)
      this.query.query.bool.filter.push({ range: { 'price.validityFrom': { lte: params.deliverydate } } },
        { range: { 'price.validityTo': { gte: params.deliverydate } } });


    return this.query;
  }
}

module.exports = Query;