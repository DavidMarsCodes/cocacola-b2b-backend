/**
 * Parsea respuesta GET sugessted product
 * @param {object} suggestedProductData
 * @returns {object}
 */
const suggestedProducts = suggestedProductData => {

  const suggestedProducts = suggestedProductData.hits.hits;

  const parsedSuggestedProducts = suggestedProducts.map(product => {
    const data = product._source;
    if (data.productGroup && data.productGroup.macroCategory)
      data.productGroupName = data.productGroup.macroCategory;

    return data;
  });

  return parsedSuggestedProducts;

};

module.exports = { suggestedProducts };
