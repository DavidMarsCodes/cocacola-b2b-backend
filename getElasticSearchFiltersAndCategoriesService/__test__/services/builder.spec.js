const Query = require('../../services/builder');

describe('Query Class', () => {
  it('Validate that an instance of the Query class exists.', () => {
    const query = new Query();

    expect(query).toBeTruthy();
    expect(query).toBeInstanceOf(Query);
  });

  it('validate the functionality of the method setTerm', () => {
    const data = {
      cpgId: '001',
      countryId: 'AR',
      organizationId: '3043',
      transactionId: '3077c231-c352-41eb-8aaf-2457022dae77',
      clientId: '2',
      deliverydate: '2021-02-06T00:00:00.000Z',
      offset: '0',
      limit: '24',
      text: '',
      package: '',
      index: 'portfolio-product',
      size: '',
      brand: '',
      returnability: '',
      label: '',
    };

    const query = new Query();
    const result = query.setTerm(data);

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {},
        query: {
          bool: {
            filter: [
              { term: { cpgId: '001' } },
              { term: { countryId: 'AR' } },
              { term: { organizationId: '3043' } },
              { term: { clientId: '2' } },
            ],
          },
        },
      },
    });
  });

  it('validate the functionality of the method setRange', () => {
    const query = new Query();
    const result = query.setRange('2021-02-06T00:00:00.000Z');

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {},
        query: {
          bool: {
            filter: [
              { range: { 'price.validityFrom': { lte: '2021-02-06T00:00:00.000Z' } } },
              { range: { 'price.validityTo': { gte: '2021-02-06T00:00:00.000Z' } } },
            ],
          },
        },
      },
    });
  });

  it('validate the functionality of the method setFullText', () => {
    const query = new Query();
    const result = query.setFullText('text');

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {},
        query: {
          bool: {
            filter: [],
            must: { match: { full_text: 'text' } },
          },
        },
      },
    });
  });

  it('validate the functionality of the method setSort', () => {
    const query = new Query();
    const result = query.setSort();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {},
        query: { bool: { filter: [] } },
        sort: { brand: { order: 'asc' } },
      },
    });
  });

  it('validate the functionality of the method build', () => {
    const query = new Query();
    const result = query.build();

    expect(result).toEqual({
      _source: false,
      aggs: {},
      query: { bool: { filter: [] } },
    });
  });

  it('validate the functionality of the method setAggsBrand', () => {
    const query = new Query();
    const result = query.setAggsBrand();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {
          brands: {
            terms: {
              field: 'brand',
              size: 100,
            },
          },
        },
        query: { bool: { filter: [] } },
      },
    });
  });

  it('validate the functionality of the method setAggsSize', () => {
    const query = new Query();
    const result = query.setAggsSize();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {
          sizes: {
            terms: {
              field: 'size',
              size: 100,
            },
          },
        },
        query: { bool: { filter: [] } },
      },
    });
  });

  it('validate the functionality of the method setAggsPackages', () => {
    const query = new Query();
    const result = query.setAggsPackages();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {
          packages: {
            terms: {
              field: 'package',
              size: 100,
            },
          },
        },
        query: { bool: { filter: [] } },
      },
    });
  });

  it('validate the functionality of the method setAggsCategories', () => {
    const query = new Query();
    const result = query.setAggsCategories();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {
          categories: {
            terms: {
              field: 'productGroup.name',
              size: 100,
            },
          },
        },
        query: { bool: { filter: [] } },
      },
    });
  });

  it('validate the functionality of the method setAggsCategories', () => {
    const query = new Query();
    const result = query.setAggsReturnability();

    expect(result).toEqual({
      query: {
        _source: false,
        aggs: {
          returnabilities: {
            terms: {
              field: 'returnability',
              size: 100,
            },
          },
        },
        query: { bool: { filter: [] } },
      },
    });
  });

});