module.exports = {
  buildInvoiceDeadlinePlan: (invoiceDeadlinePlan, erpParams) => {
    const newInvoiceDeadlinePlan = {
      ...erpParams,
      ...invoiceDeadlinePlan,
    };

    delete newInvoiceDeadlinePlan.deadlineTime;
    delete newInvoiceDeadlinePlan.timezone;
    delete newInvoiceDeadlinePlan.deadlineDate;

    if (!newInvoiceDeadlinePlan.description)
      newInvoiceDeadlinePlan.description = '';


    return newInvoiceDeadlinePlan;
  },

  buildInvoiceDeadlinePlanItem: (invoiceDeadlinePlan, invoiceDeadlinePlanId, erpParams) => {
    const newInvoiceDeadlinePlanItem = {
      ...erpParams,
      invoiceDeadlinePlanId,
      deadlineDate: invoiceDeadlinePlan.deadlineDate ? new Date(invoiceDeadlinePlan.deadlineDate) : null,
      deadlineTime: invoiceDeadlinePlan.deadlineTime ? invoiceDeadlinePlan.deadlineTime : null,
      timezone: invoiceDeadlinePlan.timezone,
    };

    return newInvoiceDeadlinePlanItem;
  },
};