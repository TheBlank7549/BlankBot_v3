const { MessageEmbed } = require('discord.js');

module.exports = client => {
    // Gets the names of all the commands from the clint.commands collection, then formatting then between backticks
    const cmdArr = client.commands.map(cmd => cmd.info);
    const miscCmds = cmdArr.filter(cmd => cmd.category === 'misc').map(miscCmd => `\`${miscCmd.name}\``).join(', ');
    const adminCmds = cmdArr.filter(cmd => cmd.category === 'admin').map(adminCmd => `\`${adminCmd.name}\``).join(', ');
    const ownerCmds = cmdArr.filter(cmd => cmd.category === 'owner').map(ownerCmd => `\`${ownerCmd.name}\``).join(', ');
    const utilityCmds = cmdArr.filter(cmd => cmd.category === 'utility').map(utilityCmd => `\`${utilityCmd.name}\``).join(', ');

    // Constructs a basic embed
    const defaultHelpEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setDescription(`Shows all the available commands\nSee additional information about commands with: \n\`${process.env.defPREFIX}help <command name>\``);
    const ownerHelpEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setDescription('Shows all the available commands, including owner exclusive ones');

    // Adds fields to the basic embed where needed
    if (!miscCmds && !adminCmds && !ownerCmds) {
        defaultHelpEmbed.addField('Oops', 'No commands could be found');
        ownerHelpEmbed.addField('Oops', 'No commands could be found');
        return;
    };

    if (ownerCmds) {
        ownerHelpEmbed.addField('Owner Commands:', ownerCmds);
    };

    if (adminCmds) {
        defaultHelpEmbed.addField('Admin Commands:', adminCmds);
        ownerHelpEmbed.addField('Admin Commands:', adminCmds);
    };

    if (utilityCmds) {
        defaultHelpEmbed.addField('Utility Commands:', utilityCmds);
        ownerHelpEmbed.addField('Utility Commands:', utilityCmds);
    };

    if (miscCmds) {
        defaultHelpEmbed.addField('Misc Commands:', miscCmds);
        ownerHelpEmbed.addField('Misc Commands:', miscCmds);
    };

    // Adds the embed to the client.commands collection as "defaultHelp"
    client.helpEmbeds.set('defaultHelp', defaultHelpEmbed);
    client.helpEmbeds.set('ownerHelp', ownerHelpEmbed);
    console.log('Help commands loaded');
};