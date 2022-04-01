module.exports = {
  buildRequireParams: (event) => {
    const data = { ...event };
    return {
      cpgId: data.cpgId,
      countryId: data.countryId,
      organizationId: data.organizationId,
      clientId: data.clientId,
      deliverydate: data.priceDateByCountry,
    };
  },

  buildKeyTable: (event) => {
    const data = { ...event };
    return { paramId: data.cpgId + '-' + data.countryId + '-' + data.organizationId };
  },

  buidKeyTableDiscountDomainModel: (event, pricesDate) => {
    const data = { ...event };
    const formatedPriceDate = pricesDate.substring(0, pricesDate.indexOf('T'));
    return `${data.cpgId}-${data.countryId}-${data.organizationId}-${data.clientId}-${formatedPriceDate}`;
  },

  buidSortKeyTableDiscountDomainModel: (event, pricesDate) => {
    const data = { ...event };
    const formatedPriceDate = pricesDate.substring(0, pricesDate.indexOf('T'));
    return `${data.cpgId}-${data.countryId}-${data.organizationId}-${formatedPriceDate}`;
  },
};