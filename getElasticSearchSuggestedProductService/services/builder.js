class Query {

    #enabledFilters = {
      cpgId: 'cpgId',
      countryId: 'countryId',
      organizationId: 'organizationId',
      clientId: 'clientId',
      package: 'package',
      size: 'size',
      brand: 'brand',
      returnability: 'returnability',
      category: 'productGroup.name',
    };

    constructor () {
      this.query = {
        query: {
          bool: {
            filter: [
              { range: { 'suggestedProduct.quantity': { gt: 0 } } },
              { term: { 'suggestedProduct.isSuggested': true } },
            ],
          },
        },
      };
    }

    /**
     * @returns {object} - Query data.
     */
    build() {
      return this.query;
    }

    /** Set the query filters for the arguments that must match strictly.
     * @param  {object} data - Input parameters to form the filters.
     */
    setTerm(data) {
      for (const property in data)
        if (data[property] && this.#enabledFilters.hasOwnProperty(property))
          this.query.query.bool.filter.push({ term: { [this.#enabledFilters[property]]: data[property] } });



      return this;
    }

    /** Set the query filters for the time interval arguments.
     * @param  {date} from - Indicates the dates from.
     * @param  {date} to - Indicate the dates until.
     */
    setRange(from, to) {
      if (!to) to = from;

      this.query.query.bool.filter.push({ range: { 'price.validityFrom': { lte: from } } },
        { range: { 'price.validityTo': { gte: to } } });
      return this;
    }

    /** Set the paging parameters for the query.
     * @param  {number} offset = 0 - Reference from which records we want to obtain results.
     * @param  {number} limit = 20 - Reference the limit of records to be obtained.
     */
    setPagination(offset = 0, limit = 20) {
      this.query.size = limit;
      this.query.from = offset;
      return this;
    }

    /** Set the query arguments to perform a non-strict search.
     * @param  {string} text - Courage to perform a loose search.
     */
    setFullText(text) {
      if (!text) return this;
      this.query.query.bool.must = { match: { full_text: text } };
      return this;
    }

    /** Set the query arguments to perform the ordering of the records.
     * @param  {string} sortBy = "brand" - Property by which you want to sort the records.
     * @param  {string} sortOrder = "asc" - Type of ordering to be carried out.
     */
    setSort(sortBy = 'brand', sortOrder = 'asc') {
      this.query.sort = { [sortBy]: { order: `${sortOrder}` } };
      return this;
    }

}

module.exports = Query;