const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'say',
  aliases: ['tell', 'speak'],
  category: "utility",
  minArgs: 1,
  description: 'Say something as the bot xD',
  usage: 'say <text>'
};

module.exports.run = async (client, msg, args) => {
  const text = msg.content.split(/ +/g).slice(1).join(' ');

  msg.channel.send({
    content: text
  }).then(() => msg.delete()).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};