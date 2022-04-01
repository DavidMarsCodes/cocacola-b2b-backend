const log = require('./log');
const errEvent = require('./error.handler');
const enabledStates = require('./constants/status');
const awsRepositories = require('b2b-aws-repositories');
const Mapper = require('./mapper');
const lodash = require('lodash');

const orderItemDetailTable = `${process.env.ENVIRONMENT.toLowerCase()}OrderItemDetail`;

const services = {
  log,
  errEvent,
  enabledStates,
  Mapper,
  awsRepositories,
  lodash,
  orderItemDetailTable,
};

const { transactions } = require('./transactions')(services);

module.exports = { transactions };