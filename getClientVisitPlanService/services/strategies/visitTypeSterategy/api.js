module.exports = strategy => {
  const getVisitPlanByVisitType = services => strategy.getVisitPlan(services);

  return { getVisitPlanByVisitType };
};