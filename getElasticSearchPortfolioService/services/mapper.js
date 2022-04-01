class Mapper {

  static portfolioMap(portfolioData) {
    return portfolioData.hits.hits.map((product) => {
      const data = product._source;
      if (data.productGroup && data.productGroup.macroCategory) {
        data.productGroupName = data.productGroup.macroCategory;
        delete data.productGroup;
      }
      return data;
    });
  }

}

module.exports = Mapper;