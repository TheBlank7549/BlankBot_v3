const logger = require('../functions/logger.js');
const helpLoader = require('../functions/helpLoader.js');
module.exports = client => {
    helpLoader(client);
    logger.logStartup(client);
    console.log('BlankBot_v3 is now online');
};