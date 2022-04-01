module.exports = ({
  repositories,
  experts,
  res,
  awsRepositories,
  getTableNames,
  builder,
}) => ({

  /**
   * Service to delete discounts in groups by  cpg, country, organization, system date only
   * @param  {object} event asd
   * @returns {object} HTTP result response of operation
   */
  deleteDiscountDomainService: async (event) => {
    let closeConnection;
    try {

      ({ closeConnection } = await repositories());

      experts.discount.validateDiscountDiscretionaryGetAllRequiredParams(event);

      const itemsToDelete = [];
      const { Repository } = awsRepositories;
      const { DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL } = await getTableNames();

      const data = builder.buidSortKeyTableDiscountDomainModel(event);

      const discoutDomains = await Repository.query(DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL, 'discountValidityDate', data);

      if (discoutDomains.Items) {
        console.info(`There were found ${discoutDomains.Items.length} using the value ${data} to filter on discountValidityDate`);
        discoutDomains.Items.forEach((discountDomainModel) => {
          itemsToDelete.push({ DeleteRequest: { Key: { domainModelId: discountDomainModel.domainModelId } } });
        });
      }

      if (itemsToDelete.length) {
        await Repository.batchRemove(DYNAMODB_TABLE_DISCOUNT_DOMAIN_MODEL, itemsToDelete);
        console.info(`Batch delete has ended`);
      }

      return res.sendStatus(201);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(e));
    } finally {
      await closeConnection();
    }
  },

});
