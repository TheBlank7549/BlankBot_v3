const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'dice',
  aliases: ['roll'],
  category: "utility",
  description: 'Rolls a dice',
  usage: 'dice [number of sides of the dice]'
};

module.exports.run = (client, msg, args) => {
  let multiplier = 6;
  if (args[0]) multiplier = Number(args[0]);

  if (!multiplier) return msg.channel.send({
    content: `\`${args[0]}\` is not a valid number`
  }).catch(console.error);

  let randomNum = Math.ceil(Math.random() * multiplier);
  msg.channel.send({
    content: `**${msg.author.username}** is rolling a ${multiplier} sided dice`
  }).then(m => {
    setTimeout(() => {
      m.edit({
        content: `**${msg.author.username}** rolled a **${randomNum}**`
      });
    }, 1000 * 1);
  }).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};