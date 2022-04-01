const util = require('util');

module.exports = async (getInstanceQueue, uuid, event, Item) => {

  const { v4: uuidv4 } = uuid;
  const messageData = {
    msgBody: {
      transactionId: event.transactionId,
      Item,
    },
    msgGroupId: `confirmOrder.updateCredit-${event.cpgId}-${event.countryId}-${event.organizationId}-${event.orderId}-${event.clientId}`,
    msgDedupId: uuidv4(),
  };

  // Get an instance of our queue service.
  const queues = await getInstanceQueue();

  // Send message to queue.
  const sqsRes = await queues.send(messageData);
  console.log(util.inspect(sqsRes, false, null, true /* enable colors */));

  console.info('The message was sent successfully to the queue. Message information: ', { sqsRes, message: messageData });

};