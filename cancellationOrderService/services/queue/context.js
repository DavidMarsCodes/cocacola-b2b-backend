const getConfigQueue = require('./aws.config');
const SQS = require('b2b-aws-sqs');
const QUEUE = require('./queue');


// Generates an inversion of control context to obtain an instance of the queue module.
const contextInstanceQueue = (getConfigQueue, SQS, QUEUE) => async () => {
  // Initialize settings for the AWS SDK.
  const awsConfig = { region: process.env.AWS_REGION };

  // Get the settings from the queue.
  const { URL_SQS } = await getConfigQueue(awsConfig);

  // Generate an instance of the queue module to use.
  const sqs = new SQS(awsConfig, URL_SQS);

  // Generate an instance of our high-level module that will handle the sending of messages to the queue.
  return new QUEUE(sqs);
};

module.exports = contextInstanceQueue(getConfigQueue, SQS, QUEUE);