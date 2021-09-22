const logger = require('../../functions/logger.js');
const { MessageEmbed } = require('discord.js');

module.exports.info = {
    name: 'help',
    category: "misc",
    description: 'Shows the available commands',
    usage: 'help [command name]'
};

module.exports.run = async (client, msg, args) => {
    const { prefix, ownerId } = client.data.get('config');
    // Checks if the default help is wanted, or a specific one
    if (args[0]) {
        let command;
        // Gets the target cmd from the client.commands collection
        if (client.commands.has(args[0])) {
            command = client.commands.get(args[0]);
        } else if (client.aliases.has(args[0])) {
            command = client.commands.get(client.aliases.get(args[0]));
        } else {
            // Executed if the target cmd doesn't exist
            let { prefix } = config;
            msg.channel.send({
                content: `The \`${args[0]}\` command does not exist\nSee a list of all commands with \`${prefix}help\``
            }).catch(console.error);
            logger.logFailedCmd(client, msg);
            return;
        };

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
        }).catch(console.error);
        logger.logSuccessfulCmd(client, msg);
        return;
    };

    // The default help, if no specific cmd is given
    // Gets the names of all the commands from the clint.commands collection, then formatting then between backticks. joined with commas
    const cmdArr = client.commands.map(cmd => cmd.info);
    const ownerCmds = cmdArr.filter(cmd => cmd.category === 'owner').map(ownerCmd => `\`${ownerCmd.name}\``).join(', ');
    const adminCmds = cmdArr.filter(cmd => cmd.category === 'admin').map(adminCmd => `\`${adminCmd.name}\``).join(', ');
    const utilityCmds = cmdArr.filter(cmd => cmd.category === 'utility').map(utilityCmd => `\`${utilityCmd.name}\``).join(', ');
    const miscCmds = cmdArr.filter(cmd => cmd.category === 'misc').map(miscCmd => `\`${miscCmd.name}\``).join(', ');

    // Constructing the basic embed
    const defaultHelpEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setDescription(`Shows all the available commands\nSee additional information about commands with: \n\`${prefix}help <command name>\``)
        .setTimestamp();

    // Adding the fields as needed
    if (ownerCmds && msg.author.id === ownerId) defaultHelpEmbed.addField('Owner Commands:', ownerCmds);
    if (adminCmds) defaultHelpEmbed.addField('Admin Commands:', adminCmds);
    if (utilityCmds) defaultHelpEmbed.addField('Utility Commands:', utilityCmds);
    if (miscCmds) defaultHelpEmbed.addField('Misc Commands:', miscCmds);

    msg.channel.send({
        embeds: [defaultHelpEmbed]
    }).catch(console.error);
    logger.logSuccessfulCmd(client, msg);
};