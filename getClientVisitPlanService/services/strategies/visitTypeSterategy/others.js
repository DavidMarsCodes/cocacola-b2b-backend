module.exports = ({ experts, luxon }) => ({

  /** Set the data in the template and in the subject.
     * @param  {string} message - Email body.
     * @returns {object} - Returns the body of the email and the subject of the email with the values set.
     */
  getVisitPlan: async ({ VisitPlan, data }) => {
    console.info('The selected strategy is others');

    // Crear fecha
    const today = luxon.DateTime.utc().toISODate();

    // Get the available visit plans. Todo: Modificar nombre del metodo y parametros.
    const visitPlans = await VisitPlan.getVisitPlansByVisitTypeAndDeliveryDate(data, today, data.offset, data.limit);
    experts.visitPlan.validateExistsResult(visitPlans, { data, today });

    return visitPlans;
  },
});