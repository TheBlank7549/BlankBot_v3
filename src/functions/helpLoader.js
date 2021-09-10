const { MessageEmbed } = require('discord.js');

module.exports = client => {
    // Gets the names of all the commands from the clint.commands collection, then formatting then between backticks
    const cmdArr = client.commands.map(cmd => cmd.info);
    const miscCmds = cmdArr.filter(cmd => cmd.category === 'misc').map(miscCmd => `\`${miscCmd.name}\``).join(' ');
    const adminCmds = cmdArr.filter(cmd => cmd.category === 'admin').map(adminCmd => `\`${adminCmd.name}\``).join(' ');
    const ownerCmds = cmdArr.filter(cmd => cmd.category === 'owner').map(ownerCmd => `\`${ownerCmd.name}\``).join(' ');
    const utilityCmds = cmdArr.filter(cmd => cmd.category === 'utility').map(utilityCmd => `\`${utilityCmd.name}\``).join(' ');

    // Constructs a basic embed
    const defaultHelpEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setDescription('Shows all the available commands')
        .setTimestamp();

    // Adds fields to the basic embed where needed
    if (!miscCmds && !adminCmds && !ownerCmds) {
        defaultHelpEmbed.addField('Oops', 'No commands could be found');
    }
    if (miscCmds) defaultHelpEmbed.addField('Misc Commands:', miscCmds);
    if (adminCmds) defaultHelpEmbed.addField('Admin Commands:', adminCmds);
    if (ownerCmds) defaultHelpEmbed.addField('Owner Commands:', ownerCmds);
    if (utilityCmds) defaultHelpEmbed.addField('Utility Commands:', utilityCmds);

    // Adds the embed to the client.commands collection as "defaultHelp"
    client.commands.set('defaultHelp', defaultHelpEmbed);
    console.log('Help command loaded');
};