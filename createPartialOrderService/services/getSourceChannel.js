module.exports = applicationClientName => {
  const applicationClientNameArray = applicationClientName.split('-');

  return applicationClientNameArray[1].toUpperCase();
};