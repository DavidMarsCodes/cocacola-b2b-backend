module.exports = {
  res: require('b2b-response'),
  experts: require('b2b-managers'),
  elasticSearchRepositories: require('b2b-aws-elasticsearch'),
  connection: require('./repositories'),
  Query: require('./builder'),
  accessControl: require('b2b-access-control'),
  dbRedis: require('./redis-repositories'),
  environment: process.env.ENVIRONMENT.toLowerCase(),
  getElasticSearchIndex: require('./elasticSearchIndex'),
  Mapper: require('./mapper'),
};
