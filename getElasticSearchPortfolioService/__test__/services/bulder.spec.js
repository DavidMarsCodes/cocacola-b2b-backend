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

  it('validate the functionality of the method setPagination', () => {
    const query = new Query();
    const result = query.setPagination();

    expect(result).toEqual({
      query: {
        from: 0,
        query: { bool: { filter: [] } },
        size: 20,
      },
    });
  });

  it('validate the functionality of the method setRange', () => {
    const query = new Query();
    const result = query.setRange('2021-02-06T00:00:00.000Z');

    expect(result).toEqual({
      query: {
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
        query: {
          bool: {
            filter: [
            ],
          },
        },
        sort: { name: { order: 'asc' } },
      },
    });
  });

  it('validate the functionality of the method build', () => {
    const query = new Query();
    const result = query.build();

    expect(result).toEqual({
      query: {
        bool: {
          filter: [
          ],
        },
      },
    });
  });

});