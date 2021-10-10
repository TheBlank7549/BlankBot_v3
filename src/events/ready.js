const logger = require('../functions/logger.js');
const config = require(process.env.configPath);
module.exports = client => {
  client.data.set('config', config);
  logger.logStartup(client);
  console.log('BlankBot_v3 is now online');
};