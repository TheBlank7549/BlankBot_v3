const logger = require('../../functions/logger.js');

module.exports.info = {
    name: 'setname',
    aliases: ['changename'],
    category: "owner",
    minArgs: 1,
    description: 'Shows the latency of the bot',
    usage: 'setname <new name>'
};

module.exports.run = async (client, msg, args) => {
    const name = msg.content.split(/ /g).slice(1).join(' ');

    await msg.channel.send({
        content: `Are you sure you want to change the name to \`${name}\`?`
    }).then(confirmQuery => {
        msgFilter = m => m.author.id === msg.author.id;
        confirmQuery.channel.awaitMessages({
            filter: msgFilter,
            max: 1,
            time: 1000 * 10,
            errors: ['time']
        }).then(collectedCollection => {
            const collectedMsg = collectedCollection.first().content.toLowerCase();

            if (collectedMsg !== 'yes' && collectedMsg !== 'y') {
                return confirmQuery.channel.send({
                    content: 'Name change aborted'
                });
            } else {
                try {
                    client.user.setUsername(name).then(() => {
                        confirmQuery.channel.send({
                            content: `Name successfully changed to \`${name}\``
                        });
                    }).catch(() => {
                        confirmQuery.channel.send({
                            content: 'The name could not be changed'
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }).catch(() => {
            confirmQuery.channel.send({
                content: 'Name change aborted'
            });
        });
    });
};