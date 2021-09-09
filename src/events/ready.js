const logger = require('../functions/logger.js');
module.exports = client => {
    console.log('BlankBot_v3 is now online');
    logger.logStartup(client);
}