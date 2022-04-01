module.exports = ({ accessControl, dbRedis, repositories, experts, res, luxon }) => ({

  /** return a invoide deadline by client.
     * @param  {object} event
     */
  getInvoiceDeadlinePlanItem: async event => {
    let InvoiceDeadlinePlanItem;
    let Client;
    let closeConnection;

    try {
      // Get repositories.
      ({ InvoiceDeadlinePlanItem, Client, closeConnection } = await repositories());

      // Check if you are authorized to access resources.
      await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);
      const { userName } = await accessControl.getSessionData(event.b2bSession.Authorization);

      // Validate required input parameters.
      experts.invoiceDeadlinePlanItem.validateInvoiceDeadlinePlanItemGetAllRequiredParams(event);

      // Get operation dates
      const redis = await dbRedis();
      const operationDates = await redis.operationDates.get(event, userName);
      experts.order.hasOperationDates(operationDates, { operationDates, message: `It not 'Operation Dates' were found for user: ${userName}` });

      // Validate if date from deadline exists in operation dates
      experts.invoiceDeadlinePlanItem.validateExistsPricesDate(operationDates);
      let { pricesDate } = operationDates;
      pricesDate = event.countryId === 'AR' ? luxon.DateTime.fromISO(pricesDate, { zone: 'utc' }).minus({ days: 1 })
        .toISODate() : luxon.DateTime.fromISO(pricesDate).toISODate();

      // Construction of the main parameters.
      const data = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
      };

      // Get Client from database and validate if exists
      const client = await Client.getDeliveryConditionAndInvoiceDeadlinePlanId(event.clientId);
      experts.client.validateExistsResult(client);

      // Get first deadline for client
      let invoiceDeadlinePlanItem = await InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId(client.invoiceDeadlinePlanId, pricesDate, data);
      experts.invoiceDeadlinePlanItem.validateExistsResult(invoiceDeadlinePlanItem);

      // Compare first deadline from client with current date
      const deadlineDate = experts.visitPlan.buildDeadlineDate(invoiceDeadlinePlanItem);
      const currentDateFormatted = experts.visitPlan.buildCurrentDate(invoiceDeadlinePlanItem.timezone);
      console.info(`Compare dates: CurrentDate: ${currentDateFormatted} is greater than DeadlineDate ${deadlineDate}`);
      const isCurrentDateAfterDeadline = experts.visitPlan.compareCurrentDateWithDeadlineDate(currentDateFormatted, deadlineDate);

      // If first deadline is equals to current date, get next deadline
      if (isCurrentDateAfterDeadline) {
        console.info('It is after the billing closing time: ', isCurrentDateAfterDeadline);
        let nextDay = experts.invoiceDeadlinePlanItem.getOneDayLater(pricesDate);
        nextDay = luxon.DateTime.fromISO(nextDay).toISODate();

        invoiceDeadlinePlanItem = await InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId(client.invoiceDeadlinePlanId, nextDay, data);
        experts.invoiceDeadlinePlanItem.validateExistsResult(invoiceDeadlinePlanItem);
      }

      return res.success(invoiceDeadlinePlanItem, 200);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await closeConnection();
    }
  },
});
