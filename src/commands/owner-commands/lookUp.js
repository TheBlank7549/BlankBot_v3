const logger = require('../../functions/logger.js');
const { MessageEmbed } = require('discord.js');

module.exports.info = {
  name: 'lookup',
  aliases: ['see', 'getmsg', 'seemsg'],
  category: "owner",
  description: 'Gives info about the provided msg',
  usage: 'lookUp <(reply) || (msg link) || ([server id] [channel id] <msg id>)>'
};

module.exports.run = async (client, msg, args) => {
  if (!args[0] && !msg.reference) {
    msg.channel.send({
      content: 'You need to specify which msg you want to get info about'
    }).catch(console.error);
    logger.logFailedCmd(client, msg);
    return;
  };

  let targetGuildId = msg.guildId;
  let targetChannelId = msg.channelId;
  let targetMsgId = msg.id;

  if (msg.reference) {
    targetGuildId = msg.guild.id;
    targetChannelId = msg.channel.id;
    targetMsgId = msg.reference.messageId;
  } else {
    let temp = getTargetInfo(msg, args);

    if (!temp.ok) {
      msg.channel.send({
        content: 'Looks like there\'s a mistake in the provided source, ckeck it and try again'
      }).catch(console.error);
      logger.logFailedCmd(client, msg);
      return;
    };

    targetGuildId = temp.gId;
    targetChannelId = temp.chId;
    targetMsgId = temp.mId;
  };

  await client.guilds.fetch(targetGuildId).then(g => {
    g.channels.fetch(targetChannelId).then(ch => {
      ch.messages.fetch(targetMsgId).then(m => {
        const pinned = m.pinned ? 'Yes' : 'No';
        const edited = m.editedTimestamp ? 'Yes' : 'No';
        const deleted = m.deleted ? 'Yes' : 'No';

        const lookUpEmbed = new MessageEmbed()
          .setColor('#ffffff')
          .setAuthor(m.author.username, m.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`Msg found!`)
          .addFields(
            { name: 'Author:', value: `${m.author.tag}\n(${m.author.id})`, inline: true },
            { name: 'Channel:', value: `${m.channel.name}\n(${m.channelId})`, inline: true },
            { name: 'Server:', value: `${m.guild.name}\n(${m.guildId})`, inline: true },
            { name: 'Content:', value: `\`${m.content}\`` ?? ' ', inline: false },
            { name: 'Pinned?', value: pinned, inline: true },
            { name: 'Edited?', value: edited, inline: true },
            { name: 'Deleted?', value: deleted, inline: true },
            { name: 'Time:', value: `<t:${Math.round(m.createdTimestamp / 1000)}:f>`, inline: false }
          ).setTimestamp();

        msg.channel.send({
          embeds: [lookUpEmbed]
        }).catch(console.error);
      }).catch(() => {
        msg.channel.send({
          content: 'The specified message could not be found'
        })
      }).catch(console.error);
    }).catch(() => {
      msg.channel.send({
        content: 'The specified channel could not be found'
      })
    }).catch(console.error);
  }).catch(() => {
    msg.channel.send({
      content: 'The specified server could not be found'
    })
  }).catch(console.error);
};

function getTargetInfo(message, arguments) {
  let ok = true;
  let gId = message.guildId;
  let chId = message.channelId;

  if (arguments[0].startsWith('https://discord.com/channels/')) {
    const matches = arguments[0].match(/(\d{18})/g);

    if (matches.length !== 3) {
      ok = false;
    } else {
      gId = matches[0];
      chId = matches[1];
      mId = matches[2];
    };
  } else {
    switch (arguments.length) {
      case 3:
        gId = arguments[0];
        chId = arguments[1];
        mId = arguments[2];
        break;
      case 2:
        chId = arguments[0];
        mId = arguments[1];
        break;
      case 1:
        mId = arguments[0];
        break;
      default:
        ok = false;
        break;
    };
  };

  return {
    ok,
    gId,
    chId,
    mId
  };
};