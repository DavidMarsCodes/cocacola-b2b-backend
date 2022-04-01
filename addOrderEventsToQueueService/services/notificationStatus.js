const isEnabled = (typesOfStates, data) => {
  const { sourceChannelEnabled, statesEnabledNotification } = typesOfStates;

  // Validate that it is an enabled channel.
  const channelEnabled = !!sourceChannelEnabled[data.sourceChannel];

  // Validate that it is an enabled state.
  const statesEnabled = !!statesEnabledNotification[data.orderStatus];

  if (!channelEnabled || !statesEnabled) {
    console.info(`Notification validation failed. channelEnabled:${channelEnabled} statesEnabled:${statesEnabled}`);
    return false;
  }

  return true;
};

module.exports = { isEnabled };