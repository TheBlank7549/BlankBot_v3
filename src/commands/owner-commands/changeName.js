const logger = require('../../functions/logger.js');

module.exports.info = {
    name: 'setname',
    aliases: ['changename'],
    category: "owner",
    minArgs: 1,
    description: 'Changes the username of the bot',
    usage: 'setname <new name>'
};

module.exports.run = async (client, msg, args) => {
    // Gets the part of the content after the cmd
    const name = msg.content.split(/ +/g).slice(1).join(' ');

    await msg.channel.send({
        // Asks for name change confirmation
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

            // Checks if the reply is "y" or "yes"
            if (collectedMsg !== 'yes' && collectedMsg !== 'y') {
                return confirmQuery.channel.send({
                    content: 'Name change aborted'
                });
            } else {
                try {
                    // CHanges the bot's username
                    client.user.setUsername(name).then(() => {
                        confirmQuery.channel.send({
                            content: `Name successfully changed to \`${name}\``
                        });
                    }).catch(() => {
                        // Executed if the name can't be changed, usually due to rate-limits
                        confirmQuery.channel.send({
                            content: 'The name could not be changed'
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }).catch(() => {
            // Executed if the reply isn't "y" or "yes"
            confirmQuery.channel.send({
                content: 'Name change aborted'
            });
        });
    });
};