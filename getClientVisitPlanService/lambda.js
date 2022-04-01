

module.exports = ({ accessControl, repositories, experts, strategies, res }) => ({

  getClientVisitPlan: async event => {
    console.info('Event received: ', event);
    let VisitPlan;
    let Client;
    let InvoiceDeadlinePlanItem;
    let closeConnection;

    try {
      // Get repositories.
      ({ VisitPlan, Client, InvoiceDeadlinePlanItem, closeConnection } = await repositories());

      // Check if you are authorized to access resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      // Validate required input parameters.
      experts.visitPlan.validGetClientVisitPlanRequiredParams(event);
      const { offset, limit } = experts.visitPlan.validPaginationParams(event.offset, event.limit, 0, 7);

      // Construction of the main parameters.
      const data = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
        visitType: event.visitType,
        offset,
        limit,
      };

      // Ejecutar la estrategia.
      const strategy = strategies.visitTypeStrategy(data.visitType);
      const visitPlans = await strategy.getVisitPlanByVisitType({ Client, VisitPlan, InvoiceDeadlinePlanItem, data });

      const pagination = {
        currentpage: visitPlans.currentPage,
        count: visitPlans.count,
        offset,
        limit,
      };

      return res.success(visitPlans.data, 200, pagination);

    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      const err = experts.visitPlan.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    } finally {
      await closeConnection();
    }
  },
});