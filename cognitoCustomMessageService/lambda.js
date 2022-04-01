module.exports = ({ awsRepositories, tableName, res }) => ({

  /** Description.
     * @param  {object} event
     */
  getCognitoCustomMessage: async event => {

    try {
      const { Repository } = awsRepositories;

      const dynamoTeamplate = await Repository.get(tableName, { messageType: event.triggerSource });

      if (event.triggerSource === event.triggerSource) {
        event.response.emailSubject = dynamoTeamplate.Item.subject;
        event.response.emailMessage = dynamoTeamplate.Item.message.replace('##CODE##', event.request.codeParameter);
      }

      return event;

    } catch (error) {
      console.error(error);
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(error));
    }

  },

});