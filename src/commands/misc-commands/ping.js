const logger = require('../../functions/logger.js');

module.exports.info = {
    name: 'ping',
    category: "misc",
    description: 'Shows the latency of the bot',
    usage: 'ping'
};

module.exports.run = async (client, msg, args) => {
    await msg.channel.send({
        content: 'Ping?'
    }).then(m => {
        m.edit({
            content: `Pong, but \`${m.createdTimestamp - msg.createdTimestamp}ms\` later!`
        });
        logger.logSuccessfulCmd(client, msg);
    });
};