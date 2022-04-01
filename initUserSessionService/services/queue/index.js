const getConfigQueue = require('./aws.config');
const SQS = require('b2b-aws-sqs');
const QUEUE = require('./queue');
const contextInstanceQueue = require('./context')(getConfigQueue, SQS, QUEUE);

module.exports = contextInstanceQueue(getConfigQueue, SQS, QUEUE);