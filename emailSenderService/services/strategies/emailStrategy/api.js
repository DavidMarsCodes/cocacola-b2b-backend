module.exports = strategy => {
  const setOrderEmail = services => strategy.set(services);

  return { setOrderEmail };
};