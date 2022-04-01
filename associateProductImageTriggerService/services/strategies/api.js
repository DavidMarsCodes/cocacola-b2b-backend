module.exports = strategy => {
  const setImage = async (experts, Product, event) => await strategy.set(experts, Product, event);
  return { setImage };
};