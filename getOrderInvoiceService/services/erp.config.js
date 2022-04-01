const { getErpConfiguration } = require('./aws.config');
const erpManager = require('b2b-erp');

const initializeInstanceOfERPManager = ({ getErpConfiguration, erpManager }) => async ({ countryId, organizationId, documentNumber }) => {
  const erpConfig = await getErpConfiguration();
  erpConfig.endpointUrl = erpConfig.endpointUrl.replace('{countryId}', countryId)
    .replace('{organizationId}', organizationId)
    .replace('{documentType}', '33')
    .replace('{documentNumber}', documentNumber);

  erpManager.updateConfig(erpConfig);

  return erpManager;
};

const init = initializeInstanceOfERPManager({ getErpConfiguration, erpManager });

module.exports = { init };