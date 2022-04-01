module.exports = (strategy) => {
  const setOrder = async (services) => await strategy.set(services);

  return { setOrder };
};