module.exports = (
  {
    accessControl,
    repositories,
    res,
    dbRedis,
    luxon,
    lodash,
    getInstanceQueue,
    uuid,
  }) => ({

  /** Description.
     * @param  {object} event - input data
     * @returns {object} HttpStatus 201
     */
  initUserSession: async (event) => {

    let redis;
    let Discount;
    let closeConnection;

    try {
      redis = await dbRedis();
      const hasDataLoaded = await redis.clientDataLoaded.get(event);

      if (hasDataLoaded) {
        return res.success({}, 201);
      }

      ({ Discount, closeConnection } = await repositories());

      const authorizeAndGetUsername = await accessControl.getAuthorization(event.b2bSession.Authorization, event.clientId);

      const { v4: uuidv4 } = uuid;
      const messageData = {
        msgBody: {
          cpgId: event.cpgId,
          countryId: event.countryId,
          organizationId: event.organizationId,
          username: authorizeAndGetUsername.username,
        },
        msgGroupId: `initUserSession.updateCredit-${event.cpgId}-${event.countryId}-${event.organizationId}-${event.clientId}`,
        msgDedupId: uuidv4(),
      };
      console.info('logging msg sent to SQS: ', messageData);

      // Get an instance of our queue service.
      const queues = await getInstanceQueue;

      // Send message to queue.
      const sqsRes = await queues.send(messageData);
      console.info('The message was sent successfully to the queue. Message information: ', { sqsRes, message: messageData });

      const { DateTime } = luxon;
      const params = {
        cpgId: event.cpgId,
        countryId: event.countryId,
        organizationId: event.organizationId,
        clientId: event.clientId,
      };

      const discounts = await Discount.getAll(params);

      const translateFilterData = discounts.map((discount) => discount.toJSON());

      await redis.clientDiscount.upsert(event, translateFilterData);

      const now = DateTime.utc();
      const endDay = now.endOf('day');
      const ttl = endDay.diff(now, 'second').toObject().seconds;

      await redis.clientDataLoaded.upsert(event, true, lodash.round(ttl));

      return res.success({}, 201);
    } catch (e) {
      console.error(e);
      if (e.customError) {
        const err = e.getData();
        return res.error(err.msg, err.code, err.type, err.httpStatus);
      }
      return res.error('internal_server_error', 0, 'Server_Error', 500);
    } finally {
      await redis.closeConnection();
      if (closeConnection) {
        await closeConnection();
      }
    }
  },
});
