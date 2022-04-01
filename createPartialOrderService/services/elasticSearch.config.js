const { getConfigData } = require('b2b-aws-configs');
const B2bElasticSearch = require('b2b-aws-elasticsearch');
const AWS = require('aws-sdk');
const awsHttpClient = require('http-aws-es');
const { Client } = require('elasticsearch');

const init = (getConfigData, B2bElasticSearch, AWS, awsHttpClient, Client) => (awsConfig, configTable) => ({
  initElasticSearchConnection: async () => {
    const config = await getConfigData(configTable, process.env.AWS_LAMBDA_FUNCTION_NAME, awsConfig);
    const { ELASTICSEARCH_HOST } = config;
    const elasticClientConnection = new B2bElasticSearch.Connect(Client, awsHttpClient);
    return elasticClientConnection.init(ELASTICSEARCH_HOST);
  },
});

module.exports = init(getConfigData, B2bElasticSearch, AWS, awsHttpClient, Client);
