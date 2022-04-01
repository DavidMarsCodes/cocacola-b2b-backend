const init = require('./elasticSearch.config');

const awsConfig = { region: process.env.AWS_REGION };

const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;

module.exports = init(awsConfig, configTable);
