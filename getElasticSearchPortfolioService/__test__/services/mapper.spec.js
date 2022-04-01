const Mapper = require('../../services/mapper');

describe('Query Class', () => {
  it('Validate that an instance of the Query class exists.', () => {
    const elasticPortfolio = {
      took: 17,
      timed_out: false,
      _shards: {
        total: 4,
        successful: 4,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 114,
          relation: 'eq',
        },
        max_score: null,
        hits: [
          {
            _index: 'dev-portfolio-001-3043-cl-20220309121517',
            _type: '_doc',
            _id: '001-CL-3043-2-321-29906083',
            _score: null,
            _source: {
              productGroup: {
                name: 'Piscos y Licores',
                macroCategory: 'Alcoholes',
              },
              size: '275 ML',
              productId: 321,
              availability: true,
              countryId: 'CL',
              locked: false,
              cpgId: '001',
              deleted: false,
              package: 'Botella Vidrio No Retornable',
              updatedBy: 'Interface XTRACT-B2B',
              suggestedProduct: {
                quantity: 0,
                isSuggested: false,
              },
              erpUnitMeasureId: 'PAC',
              createdTime: '2022-02-25T07:38:20.000Z',
              createdBy: 'Interface XTRACT-B2B',
              price: {
                discountAmounts: [
                ],
                finalTaxes: 5531,
                others: 0,
                portfolioPriceId: 29906083,
                taxes: 5531,
                discountFixes: [
                ],
                discountPercentages: [
                ],
                discounts: 0,
                validityTo: '2099-12-31T00:00:00.000Z',
                validityFrom: '2022-02-25T00:00:00.000Z',
                finalPrice: 16483,
                listPrice: 10952,
                shippingPrice: 0,
              },
              productGroupDiscountIdList: [
                73329,
                73329,
              ],
              image: 'products/001_CL_3043_000000000000125619.jpg',
              updatedTime: null,
              clientId: 2,
              organizationId: '3043',
              sectorId: 2,
              returnability: false,
              erpProductId: '000000000000125619',
              flavor: 'Ice Fixer',
              brand: 'Alto del Carmen',
              segment: {
                name: 'ALCOHOLES',
                id: 2,
              },
              unitMeasure: 'PACK',
              sector: {
                name: 'Alcohol Alto valor ',
                id: 2,
              },
              name: 'Alto del Carmen Ice Fix er 275 ml 7° x 4',
            },
            sort: [
              'Alto del Carmen Ice Fix er 275 ml 7° x 4',
              'Alto del Carmen',
            ],
          },
        ],
      },
    };
    const mappedPortfolio = Mapper.portfolioMap(elasticPortfolio);

    expect(mappedPortfolio).toEqual([ {
      availability: true,
      brand: 'Alto del Carmen',
      clientId: 2,
      countryId: 'CL',
      cpgId: '001',
      createdBy: 'Interface XTRACT-B2B',
      createdTime: '2022-02-25T07:38:20.000Z',
      deleted: false,
      erpProductId: '000000000000125619',
      erpUnitMeasureId: 'PAC',
      flavor: 'Ice Fixer',
      image: 'products/001_CL_3043_000000000000125619.jpg',
      locked: false,
      name: 'Alto del Carmen Ice Fix er 275 ml 7° x 4',
      organizationId: '3043',
      package: 'Botella Vidrio No Retornable',
      price: { discountAmounts: [], discountFixes: [], discountPercentages: [], discounts: 0, finalPrice: 16483, finalTaxes: 5531, listPrice: 10952, others: 0, portfolioPriceId: 29906083, shippingPrice: 0, taxes: 5531, validityFrom: '2022-02-25T00:00:00.000Z', validityTo: '2099-12-31T00:00:00.000Z' },
      productGroupDiscountIdList: [ 73329, 73329 ],
      productGroupName: 'Alcoholes',
      productId: 321,
      returnability: false,
      sector: { id: 2, name: 'Alcohol Alto valor ' },
      sectorId: 2,
      segment: { id: 2, name: 'ALCOHOLES' },
      size: '275 ML',
      suggestedProduct: { isSuggested: false, quantity: 0 },
      unitMeasure: 'PACK',
      updatedBy: 'Interface XTRACT-B2B',
      updatedTime: null,
    } ]);
  });
});