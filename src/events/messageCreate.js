const { Permissions } = require('discord.js');
const logger = require('../functions/logger.js');

module.exports = async (client, msg, prefix) => {
    // Returning if the msg author is a bot
    if (msg.author.bot) return;

    // Filters out msges not starting with the prefix, otherwise preparing args and cmdUsed
    if (msg.content.toLowerCase().startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).toLowerCase().trim().split(/ /g);
        const cmdUsed = args.shift();
        let command;

        // Gets the command being used(if it exists)
        if (client.commands.has(cmdUsed)) {
            command = client.commands.get(cmdUsed);
        } else if (client.aliases.has(cmdUsed)) {
            command = client.commands.get(client.aliases.get(cmdUsed));
        } else {
            return;
        };

        try {
            const { category, minArgs, maxArgs, usage } = command.info

            // Checks for requirements if the command is from a restricted category
            if (category === 'owner' && msg.author.id !== '713019901333340192') {
                await msg.channel.send({
                    content: `<@${msg.author.id}> You do not have permission to use this command`
                }).then(reply => {
                    setTimeout(() => reply.delete(), 10000);
                });
                logger.logFailedCmd(client, msg);
                return;
            };
            if (category === 'admin' && !msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                await msg.channel.send({
                    content: `<@${msg.author.id}> You do not have permission to use this command.\nContact a server administrator if needed`
                }).then(reply => {
                    setTimeout(() => reply.delete(), 10000);
                });
                logger.logFailedCmd(client, msg);
                return;
            };

            // Checks if any arg count requirements are met
            if (minArgs !== undefined && args.length < minArgs || maxArgs !== undefined && args.length > maxArgs) {
                msg.channel.send({
                    content: `Incorrect number of arguments provided, correct usage:\n\`${prefix}${usage}\``
                });
                logger.logFailedCmd(client, msg);
                return;
            }

            command.run(client, msg, args);

        } catch (error) {
            console.log(error);
        };
    };
}