const logger = require('../../functions/logger.js');

module.exports.info = {
    name: 'say',
    alises: ['tell', 'speak'],
    category: "misc",
    minArgs: 1,
    description: 'Says something on your behalf',
    usage: 'say <text>'
};

module.exports.run = async (client, msg, args) => {
    const text = msg.content.split(/ +/g).slice(1).join(' ');

    msg.channel.send({
        content: text
    }).then(() => msg.delete())
    logger.logSuccessfulCmd(client, msg);
};