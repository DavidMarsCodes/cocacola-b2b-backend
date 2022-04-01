const queueMessage = orderData => {
  const orderMessage = {};

  const enabledProperties = [ 'cpgId', 'countryId', 'organizationId', 'orderId', 'erpOrderId', 'orderStatus', 'reason', 'name', 'amount', 'email', 'erpClientId', 'deliveryDate', 'streetAndNumber' ];

  for (const property in orderData)
    if (enabledProperties.includes(property)) orderMessage[property] = orderData[property];


  return orderMessage;
};


module.exports = { queueMessage };