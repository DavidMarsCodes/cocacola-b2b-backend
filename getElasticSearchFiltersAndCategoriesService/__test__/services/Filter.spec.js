const Filter = require('../../services/Filter');

describe('Filter class', () => {
  it('Validate that an instance of the Filter class exists.', () => {
    const filter = new Filter();

    expect(filter).toBeTruthy();
    expect(filter).toBeInstanceOf(Filter);
  });

  it('validate the functionality of the method brandsMap', () => {
    const brands = {
      buckets: [
        {
          key: 'Coca-Cola',
          doc_count: 3,
        },
        {
          key: 'Coca-Cola Zero',
          doc_count: 3,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .brandsMap(brands.buckets)
      .getFilter();

    expect(result).toEqual({
      brands: [
        'Coca-Cola',
        'Coca-Cola Zero',
      ],
    });

  });

  it('validate the functionality of the method sizesMap', () => {
    const sizes = {
      buckets: [
        {
          key: '1.5 LTR',
          doc_count: 10,
        },
        {
          key: '300 ML',
          doc_count: 5,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .sizesMap(sizes.buckets)
      .getFilter();

    expect(result).toEqual({
      sizes: [
        '1.5 LTR',
        '300 ML',
      ],
    });

  });

  it('validate the functionality of the method packagesMap', () => {
    const packages = {
      buckets: [
        {
          key: 'Wax Paperboard Brick Pack',
          doc_count: 36,
        },
        {
          key: 'Tetra Pak',
          doc_count: 5,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .packagesMap(packages.buckets)
      .getFilter();

    expect(result).toEqual({
      packages: [
        'Wax Paperboard Brick Pack',
        'Tetra Pak',
      ],
    });
  });

  it('validate the functionality of the method categoriesMap', () => {
    const categories = {
      buckets: [
        {
          key: 'Sin categoria',
          doc_count: 41,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .categoriesMap(categories.buckets)
      .getFilter();

    expect(result).toEqual({
      categories: [
        'Sin categoria',
      ],
    });
  });

  it('validate the functionality of the method returnabilityMap when there are returnable and disposable documents', () => {
    const returnabilities = {
      buckets: [
        {
          key: 0,
          key_as_string: 'false',
          doc_count: 379,
        },
        {
          key: 1,
          key_as_string: 'true',
          doc_count: 50,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .returnabilityMap(returnabilities.buckets)
      .getFilter();

    expect(result).toEqual({
      returnabilities: {
        hasReturnable: true,
        hasDisposable: true,
      },
    });
  });

  it('validate the functionality of the method returnabilityMap when there are no returnable and disposable documents', () => {
    const returnabilities = {
      buckets: [
        {
          key: 0,
          key_as_string: 'false',
          doc_count: 0,
        },
        {
          key: 1,
          key_as_string: 'true',
          doc_count: 0,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .returnabilityMap(returnabilities.buckets)
      .getFilter();

    expect(result).toEqual({
      returnabilities: {
        hasReturnable: false,
        hasDisposable: false,
      },
    });
  });

  it('validate the functionality of the method returnabilityMap when there are disposable documents and there are no returnables', () => {
    const returnabilities = {
      buckets: [
        {
          key: 0,
          key_as_string: 'false',
          doc_count: 1,
        },
        {
          key: 1,
          key_as_string: 'true',
          doc_count: 0,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .returnabilityMap(returnabilities.buckets)
      .getFilter();

    expect(result).toEqual({
      returnabilities: {
        hasReturnable: false,
        hasDisposable: true,
      },
    });
  });

  it('validate the functionality of the method returnabilityMap when there are returnable documents and there is no disposable', () => {
    const returnabilities = {
      buckets: [
        {
          key: 0,
          key_as_string: 'false',
          doc_count: 0,
        },
        {
          key: 1,
          key_as_string: 'true',
          doc_count: 1,
        },
      ],
    };

    const filter = new Filter();
    const result = filter
      .returnabilityMap(returnabilities.buckets)
      .getFilter();

    expect(result).toEqual({
      returnabilities: {
        hasReturnable: true,
        hasDisposable: false,
      },
    });
  });
});