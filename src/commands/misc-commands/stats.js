const { MessageEmbed } = require('discord.js');
const logger = require('../../functions/logger.js');
const timeConverter = require('../../functions/timeConverter.js');

module.exports.info = {
  name: 'stats',
  category: "misc",
  description: 'Shows general bot statistics',
  usage: 'stats'
};

module.exports.run = async (client, msg, args) => {
  // Gets necessary information from the config file
  const {
    version,
    engine,
    primaryFramework,
    prefix,
    owner
  } = client.data.get('config');

  const statsEmbed = new MessageEmbed()
    .setColor('#ffffff')
    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
    .setTitle('Bot Statistics')
    .addFields(
      {
        name: 'Version:',
        value: version,
        inline: true
      },
      {
        name: 'Engine:',
        value: engine,
        inline: true
      },
      {
        name: 'Primary Library:',
        value: primaryFramework,
        inline: true
      },
      {
        name: 'Owner:',
        value: owner,
        inline: true
      },
      {
        name: 'Currently in:',
        value: `${client.guilds.cache.size.toString()} servers`,
        inline: true
      },
      {
        name: 'Uptime:',
        value: timeConverter.fromMS(client.uptime),
        inline: true
      },
      {
        name: 'Prefix:',
        value: prefix,
        inline: true
      },
      {
        name: 'Commands:',
        value: client.commands.size.toString(),
        inline: true
      },
      {
        name: 'Support Server:',
        value: '[Join](https://www.google.com)',
        inline: true
      },
    )
    .setTimestamp();

  msg.channel.send({
    embeds: [statsEmbed]
  }).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};