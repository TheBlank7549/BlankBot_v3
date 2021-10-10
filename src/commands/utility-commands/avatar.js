const { MessageEmbed } = require('discord.js');
const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'avatar',
  aliases: ['av', 'pfp'],
  category: "utility",
  description: 'Shows the target\'s or user\'s avatar',
  usage: 'avatar [@ or id of target]'
};

module.exports.run = async (client, msg, args) => {
  let targetId = msg.author.id;
  let target;

  try {
    // Gets a clean id from the first arg, else the author id is used
    if (args[0]) targetId = args[0].match(/^<?@?!?(\d{18})>?$/)[1];
    // Gets the target as a member from the guild
    await msg.guild.members.fetch(targetId).then(member => {
      target = member;
    }).catch(console.error);
  } catch (error) {
    console.log(error);
  };

  // Returns if no target could be found
  if (!target) {
    msg.channel.send({
      content: 'I could not find that user'
    }).catch(console.error);
    logger.logFailedCmd(client, msg);
    return;
  }

  const avatarEmbed = new MessageEmbed()
    .setColor('#ffffff')
    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${target.user.username}'s Avatar`)
    .setImage(target.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  msg.channel.send({
    embeds: [avatarEmbed]
  }).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};