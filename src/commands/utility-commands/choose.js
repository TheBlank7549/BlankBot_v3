const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'choose',
  aliases: ['pick'],
  category: "utility",
  minArgs: 1,
  description: 'Chooses an option from a given list',
  usage: 'choose <option1> [option2] [option3] ...'
};

module.exports.run = (client, msg, args) => {
  // Picks a random number to correspond to an index in the args array
  const randomNum = Math.floor(Math.random() * args.length);
  msg.channel.send({
    content: `I choose \`${args[randomNum]}\``
  }).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};