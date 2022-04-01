module.exports = {
  createOrUpdate: async ({ opdates, event, visitPlan, experts, parameters }) => {

    if (event.visitType == 'delivery')
      opdates.pricesDate = experts.portfolio.priceDateByCountry(event, parameters.Item.params.DATE_FOR_OPERATIONS),
      opdates.deliverydate = visitPlan.deliverydate;
    else
      opdates.deliveryfrozen = visitPlan.deliveryfrozen;

    return opdates;
  },
};