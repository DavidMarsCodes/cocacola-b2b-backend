const enabledStates = {
  INITIATED: 'INITIATED',
  CREATED: 'CREATED',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  REGISTERED: 'REGISTERED',
  PREPARING: 'PREPARING',
  TRANSIT: 'TRANSIT',
  DELIVERED_CLT: 'DELIVERED_CLT',
  RETURNED: 'RETURNED',
  BLOCKED: 'BLOCKED',
  CANCELLED: 'CANCELLED',
};

const templateByState = {
  CREATED: 'CREATED',
  DEFAULT: 'DEFAULT',
  REASON: 'REASON',
};

const statesEnabledNotification = {
  REGISTERED: 'Ingresado',
  // PREPARING: 'En preparación',
  CREATED: 'Ingresado',
  TRANSIT: 'En tránsito',
  DELIVERED_CLT: 'Entregado',
  RETURNED: 'Retornado',
  BLOCKED: 'Bloqueado',
  CANCELLED: 'Cancelado',
};

module.exports = {
  enabledStates,
  templateByState,
  statesEnabledNotification,
};