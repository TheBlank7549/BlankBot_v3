const logger = require('../../functions/logger.js');
const { MessageEmbed } = require('discord.js');

module.exports.info = {
    name: 'help',
    category: "owner",
    description: 'Shows the available commands',
    usage: 'help [command name]'
};

module.exports.run = async (client, msg, args) => {
    if (args[0]) {
        let command;
        if (client.commands.has(args[0])) {
            command = client.commands.get(args[0]);
        } else if (client.aliases.has(args[0])) {
            command = client.commands.get(client.aliases.get(args[0]));
        } else {
            return msg.channel.send({
                content: `The \`${args[0]}\` command could not be found`
            });
        }

        const {
            name,
            aliases,
            category,
            description,
            usage
        } = command.info;

        const helpEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Command info: ${name}`)
            .setDescription(description)
            .addField('Category:', `${category}`)
            .addField('Use:', `${usage}`)
            .setTimestamp();
        if (aliases) {
            helpEmbed.addField('Aliases:', `${aliases}`);
        };

        msg.channel.send({
            embeds: [helpEmbed]
        });
        return;
    };

    const defHelpEmbed = client.commands.get('defaultHelp');
    defHelpEmbed.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
    msg.channel.send({
        embeds: [defHelpEmbed]
    });
};