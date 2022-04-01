module.exports = ({ discountsHandler, dbRedis, builder }) => async (event, rawDiscountData, exclusionsArray, priceDateByCountry) => {
  const redis = await dbRedis();

  // Id is built to query in dynamoDB.
  const discountValidityDateSortKey = builder.buidSortKeyTableDiscountDomainModel(event, priceDateByCountry);
  const discoutDomainEntity = await redis.clientDiscountDomainModel.get(event, priceDateByCountry);


  // Validate if exist discount Domain Entities in dynamoDB.
  const validatingDiscountEntity = discoutDomainEntity ? 'existDiscoutDomainEntity' : 'noExistDiscoutDomainEntity';

  // Strategies to process the order are defined.
  const strategy = {
    existDiscoutDomainEntity: () => {
      console.info('Discounts were found in dynamoDB.');
      return discountsHandler.processOrder(event, discoutDomainEntity.discounts, exclusionsArray);
    },
    noExistDiscoutDomainEntity: async () => {
      console.info('Could not find any discount in dynamoDB, proceed to create it.');
      const createDiscoutDomainEntity = discountsHandler.createDiscountEntitiesDomain(rawDiscountData, priceDateByCountry, true);

      await redis.clientDiscountDomainModel.upsert(event, priceDateByCountry, {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
        pricesDate: priceDateByCountry,
        discounts: createDiscoutDomainEntity,
        discountValidityDate: discountValidityDateSortKey,
      });

      return discountsHandler.processOrder(event, createDiscoutDomainEntity, exclusionsArray);
    },
  };

  return await strategy[validatingDiscountEntity]();

};