const util = require('util');

module.exports = ({ repositories, experts, res }) => ({

  /**
   * @description after confirmOrder execution a SQS call fires this lambda
   * to update our DB with the new available credit limit for client
   * @param {object} event - input data
   * @returns {object} - httpStatus
   */
  updateClientCreditAvailableService: async (event) => {
    let CreditLimit;
    let closeConnection;

    try {
      console.log('event');
      console.log(util.inspect(event, false, null, true /* enable colors */));

      const eventCopy = event.Records[0].body;
      console.log('eventCopy');
      console.log(util.inspect(eventCopy, false, null, true /* enable colors */));

      const eventToJSON = JSON.parse(eventCopy);
      console.debug('eventToJSON: ', eventToJSON);

      const tenantData = eventToJSON.Item.id.split('-');
      console.debug('tenantData: ', tenantData);

      const parsedData = {
        transactionId: eventToJSON.transactionId,
        cpgId: tenantData[0],
        countryId: tenantData[1],
        organizationId: tenantData[2],
        clientId: Number(tenantData[4]),
        accumulatedBySegments: eventToJSON.Item.accumulatedBySegments,
      };
      console.debug('parsedData: ', parsedData);

      ({ CreditLimit, closeConnection } = await repositories());

      experts.creditLimit.validateCreditLimitGetAllRequiredParams(parsedData);

      const getClientAvailable = await CreditLimit.getByAvailable(parsedData);

      for (const element of parsedData.accumulatedBySegments) {

        const available = getClientAvailable.available - element.subTotal;
        const creditLimitData = {
          cpgId: parsedData.cpgId,
          organizationId: parsedData.organizationId,
          countryId: parsedData.countryId,
          clientId: parsedData.clientId,
          segmentId: element.segmentId,
        };

        const updAvailable = await CreditLimit.updateAvailable(creditLimitData, available);
        console.log(`available updated for clientId: ${parsedData.clientId} - country: ${parsedData.countryId} - segmentId: ${parsedData.segmentId}, the new available is: ${available}`);

        experts.creditLimit.validateExistsResult(updAvailable);
      }

      return res.sendStatus(200);

    } catch (e) {
      console.error(e);
      if (e.customError) {
        const error = e.getData();
        return res.error(error.msg, error.code, error.type, error.httpStatus);
      }
      const err = experts.creditLimit.handlersDatabaseError(e);
      const error = err.getData();
      return res.error(error.msg, error.code, error.type, error.httpStatus, error.meta);
    } finally {
      closeConnection();
    }
  },

});