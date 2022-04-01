module.exports = ({ buildInvoiceDeadlinePlan, buildInvoiceDeadlinePlanItem }) => ({

  transactions: async (InvoiceDeadlinePlan, InvoiceDeadlinePlanItem, Repository, experts, tableNameError, transactionId, data, erpParams) => {

    const statusArray = [];

    for (invoiceDeadlinePlan of data)
      try {

        experts.invoicePlan.validationRequiredParamsUpsertInvoicePlan(invoiceDeadlinePlan);

        const newInvoiceDeadlinePlan = buildInvoiceDeadlinePlan(invoiceDeadlinePlan, erpParams);

        const { invoiceDeadlinePlanId } = await InvoiceDeadlinePlan.findOrCreate(newInvoiceDeadlinePlan);

        const newInvoiceDeadlinePlanItem = buildInvoiceDeadlinePlanItem(invoiceDeadlinePlan, invoiceDeadlinePlanId, erpParams);

        await InvoiceDeadlinePlanItem.upsert(newInvoiceDeadlinePlanItem);

        const successObject = { ...invoiceDeadlinePlan };

        successObject.operationStatus = 'Ok';

        statusArray.push(successObject);
        const createdTime = new Date().toISOString();

        await Repository.create(tableNameError, { transactionId, statusArray, createdTime });

      } catch (error) {
        const err = { ...invoiceDeadlinePlan };

        if (error.customError) {
          const e = error.getData();
          err.message = e.msg;
        } else
          err.message = error.msg ? error.msg : 'ERROR';


        err.operationStatus = 'Failed';
        statusArray.push(err);
        const createdTime = new Date().toISOString();

        await Repository.create(tableNameError, { transactionId, statusArray, createdTime });
      }


  },

});