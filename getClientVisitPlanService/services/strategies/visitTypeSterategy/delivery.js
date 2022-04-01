module.exports = ({ experts, luxon }) => ({

  /** Set the data in the template and in the subject.
     * @param  {string} message - Email body.
     * @returns {object} - Returns the body of the email and the subject of the email with the values set.
     */
  getVisitPlan: async ({ Client, VisitPlan, InvoiceDeadlinePlanItem, data }) => {
    console.info('The selected strategy is delivery');

    // Obtener desde la tabla de clietnes el DeliveryCondition y InvoiceDeadlinePlanId
    const client = await Client.getDeliveryConditionAndInvoiceDeadlinePlanId(data.clientId);
    experts.client.validateExistsResult(client);

    // Crear fecha
    const today = luxon.DateTime.utc().toISODate();
    let deliveryDate = luxon.DateTime.utc().toISODate();
    const hasDeliveryCondition = client.deliveryCondition != 0;

    // Validar si exite una condicion de envio.
    if (hasDeliveryCondition) {
      deliveryDate = experts.visitPlan.addDeliveryCondition(client.deliveryCondition);
      console.info(`${client.deliveryCondition} hours of delivery condition were added to the delivery date.`);
    }

    // Get the available visit plans. Todo: Modificar nombre del metodo y parametros.
    const visitPlans = await VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate(data, deliveryDate, data.offset, data.limit);
    experts.visitPlan.validateExistsResult(visitPlans, { data, deliveryDate });
    console.info('Visiting plans found: ', visitPlans);

    // Gets the day, time and time zone of the first available billing closing date.
    const invoiceDeadlinePlanItem = await InvoiceDeadlinePlanItem.getFirstAvailableDateByDeadlineTimeAndInvoiceDeadlinePlanId(client.invoiceDeadlinePlanId, today, data);
    experts.invoiceDeadlinePlanItem.validateExistsResult(invoiceDeadlinePlanItem, { ...data, invoiceDeadlinePlanId: client.invoiceDeadlinePlanId, today: deliveryDate });

    // Construir fecha de cierre de facturacion
    const deadlineDate = experts.visitPlan.buildDeadlineDate(invoiceDeadlinePlanItem);

    // Validar si nos encontramos por fuera del cierre de facturación.
    const currentDateFormatted = experts.visitPlan.buildCurrentDate(invoiceDeadlinePlanItem.timezone);

    console.info(`Compare dates: CurrentDate: ${currentDateFormatted} is greater than DeadlineDate ${deadlineDate}`);
    const isCurrentDateAfterDeadline = experts.visitPlan.compareCurrentDateWithDeadlineDate(currentDateFormatted, deadlineDate);
    console.info('It is after the billing closing time: ', isCurrentDateAfterDeadline);

    if (isCurrentDateAfterDeadline && !hasDeliveryCondition) {
      visitPlans.data = experts.visitPlan.removeFirstVisitPlan([ ...visitPlans.data ]);
      console.info('The first visit plan found was removed.');
    }

    console.info('Visiting plans available: ', visitPlans.data);
    return visitPlans;

  },
});