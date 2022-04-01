/** Build an object with the data to set in the email template.
 * @param  {object} orderData - Order data.
 * @returns {object} - Data to set in the template.
 */
const buildTemplateData = (orderData, urlAws) => {

  const templateData = {
    urlAws,
    orderId: orderData.erpOrderId ? orderData.erpOrderId : orderData.orderId,
    status: orderData.orderStatus,
    name: orderData.name,
    erpClientId: orderData.erpClientId,
    amount: _transform(orderData.amount || 0, orderData.countryId),
    clientId: orderData.clientId,
    deliveryDate: orderData.deliveryDate || '',
    streetAndNumber: orderData.streetAndNumber || '',
  };

  if (orderData.reason)
    templateData.reason = orderData.reason;


  return templateData;
};


const _transform = (value, countryId) => {
  let parsedNumber;
  switch (countryId) {
  case 'CL':
    parsedNumber = _parseRegular(value, '$');
    break;
  case 'AR':
    parsedNumber = _parseRegular(value, '$');
    break;
  case 'PY':
    parsedNumber = _parseRegular(value, '₲');
    break;
  case 'BR':
    parsedNumber = _parseRegular(value, 'R$');
    break;
  default:
    parsedNumber = _parseRegular(value, '$');
  }

  return `${parsedNumber}`;
};

const _parseRegular = (value, symbol) => {
  const finalValue = parseFloat(Math.trunc(value))
    .toString()
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${symbol}${finalValue}`;
};


module.exports = { buildTemplateData };
