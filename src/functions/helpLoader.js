const { MessageEmbed } = require('discord.js');

module.exports = client => {
    const cmdArr = client.commands.map(cmd => cmd.info);
    const miscCmds = cmdArr.filter(cmd => cmd.category === 'misc').map(miscCmd => `\`${miscCmd.name}\``).join(' ');
    const adminCmds = cmdArr.filter(cmd => cmd.category === 'admin').map(adminCmd => `\`${adminCmd.name}\``).join(' ');
    const ownerCmds = cmdArr.filter(cmd => cmd.category === 'owner').map(ownerCmd => `\`${ownerCmd.name}\``).join(' ');

    const defaultHelpEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setDescription('Shows all the available commands')
        .setTimestamp();

    if (!miscCmds && !adminCmds && !ownerCmds) {
        defaultHelpEmbed.addField('Oops', 'No commands could be found');
    }
    if (miscCmds) defaultHelpEmbed.addField('Misc Commands:', miscCmds);
    if (adminCmds) defaultHelpEmbed.addField('Admin Commands:', adminCmds);
    if (ownerCmds) defaultHelpEmbed.addField('Owner Commands:', ownerCmds);

    client.commands.set('defaultHelp', defaultHelpEmbed);
    console.log('Help command loaded');
}