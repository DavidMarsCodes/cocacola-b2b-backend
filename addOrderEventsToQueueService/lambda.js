module.exports = ({ typesOfStates, notificationStatus, builder, getInstanceQueue }) => ({

  /** Notify by status change orders to a queue.
     * @param  {object} event
     */
  addOrderEventsToQueue: async event => {
    try {
      console.debug(event);

      // Generate a copy of the data.
      const order = { ...event };

      // Validate that the order status is enabled to receive notifications.
      const enabled = notificationStatus.isEnabled(typesOfStates, order);
      if (!enabled) {
        console.warn('The order does not comply with a status or source channel enabled to receive notifications: ', event);
        return;
      }

      // Build the message to send.
      const messageData = builder.queueMessage(order);

      // Get an instance of our queue service.
      const queues = await getInstanceQueue();

      // Send message to queue.
      const res = await queues.send(messageData);
      console.info('The message was sent successfully to the queue. Message information: ', { res, message: messageData });

    } catch (error) {
      console.error(error);
      console.info('REQUEST EVENT:', event);
    }
  },

});