const { initService } = require('b2b-cache-repository');
const { getRedisConfig } = require('b2b-aws-configs');

const getRedisRepo = async () => {
  const awsConfig = { region: `us-east-1` };
  const configTable = `${process.env.ENVIRONMENT.toLowerCase()}Configs`;
  const config = await getRedisConfig(configTable, 'redisConnection', awsConfig);
  return await initService(config);
};

module.exports = getRedisRepo;