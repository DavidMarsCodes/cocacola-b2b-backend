module.exports = async (event, elasticPortfolioPrice, params, connection, elasticSearchRepositories, Query) => {

  const { partialResult, portfolioPriceIdList } = await elasticPortfolioPrice(event, params, connection, elasticSearchRepositories, Query);

  if (partialResult.length === 0) {
    throw new Error(`No se encontraron los siguientes ProductId: ${portfolioPriceIdList}`);
  }

  const _parserData = (discountData, type) => {
    if (!discountData) {
      return [];
    }
    return discountData.reduce((accumData, currentValue) => {
      accumData.push({
        type,
        value: Number(currentValue),
      });
      return accumData;
    }, []);
  };

  const _buildAppliedDiscountsArray = (percentage, amount, fixed) => {
    const arrayPercentage = _parserData(percentage, 'P');
    const arrayAmount = _parserData(amount, 'A');
    const arrayFixed = _parserData(fixed, 'F');

    return arrayPercentage.concat(arrayAmount, arrayFixed);
  };

  event.items = event.items.map((item) => {
    const portfolioPrice = partialResult.find((portfolioPrice) => item.productId === portfolioPrice._source.productId);
    if (portfolioPrice === undefined) {
      return null;
    }

    return {
      ...item,
      productGroup: {
        category: portfolioPrice._source.productGroup.name,
        macroCategory: portfolioPrice._source.productGroup.macroCategory,
      },
      name: portfolioPrice._source.name,
      productGroupName: portfolioPrice._source.productGroup.macroCategory,
      segmentId: portfolioPrice._source.segment.id,
      orderPosition: portfolioPrice._source.orderPosition,
      deliveryType: portfolioPrice._source.deliveryType,
      productGroupDiscountIdList: portfolioPrice._source.productGroupDiscountIdList,
      erpProductId: portfolioPrice._source.erpProductId,
      price: {
        ...item.price,
        listPrice: portfolioPrice._source.price.listPrice,
        finalPrice: portfolioPrice._source.price.finalPrice,
        taxes: portfolioPrice._source.price.taxes,
        discounts: 0,
        others: portfolioPrice._source.price.others,
        shippingPrice: portfolioPrice._source.price.shippingPrice,
        accumulatedDiscounts: _buildAppliedDiscountsArray(portfolioPrice._source.price.discountPercentages, portfolioPrice._source.price.discountAmounts, portfolioPrice._source.price.discountFixes),
      },
    };
  })
    .filter((item) => item !== null);

};