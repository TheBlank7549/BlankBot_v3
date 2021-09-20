const logger = require('../../functions/logger.js');
const { MessageEmbed } = require('discord.js');

module.exports.info = {
    name: 'help',
    category: "misc",
    description: 'Shows the available commands',
    usage: 'help [command name]'
};

module.exports.run = async (client, msg, args) => {
    // Checks if the default help is wanted, or a specific one
    if (args[0]) {
        let command;
        // Gets the target md from the client.commands collection
        if (client.commands.has(args[0])) {
            command = client.commands.get(args[0]);
        } else if (client.aliases.has(args[0])) {
            command = client.commands.get(client.aliases.get(args[0]));
        } else {
            // Executed if the target cmd doesn't exist
            msg.channel.send({
                content: `The \`${args[0]}\` command could not be found`
            });
            logger.logFailedCmd(client, msg);
            return;
        }

        // Destructures required information from the cmd info
        const {
            name,
            aliases,
            category,
            description,
            usage
        } = command.info;

        // Constructs a basic embed
        const helpEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Command info: ${name}`)
            .setDescription(description)
            .addField('Category:', `${category}`)
            .addField('Use:', `${usage}`)
            .setTimestamp();

        // Adds an aliases field, if needed
        if (aliases) {
            helpEmbed.addField('Aliases:', `${aliases}`);
        };

        msg.channel.send({
            embeds: [helpEmbed]
        });
        logger.logSuccessfulCmd(client, msg);
        return;
    };

    // The default help, if no specific cmd is given
    // Gets the "defaultHelp" embed created in helpLoader.js
    const defHelpEmbed = client.commands.get('defaultHelp');
    // Adds the author to the embed
    defHelpEmbed
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    msg.channel.send({
        embeds: [defHelpEmbed]
    });
    logger.logSuccessfulCmd(client, msg);
};