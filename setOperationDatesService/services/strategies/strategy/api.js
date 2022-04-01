module.exports = strategy => {
  const deliveryManager = services => strategy.createOrUpdate(services);

  return { deliveryManager };
};