const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'chooserange',
  aliases: ['pickrange'],
  category: "utility",
  minArgs: 2,
  description: 'Chooses a number from the given range',
  usage: 'chooseRange <lower limit> <upper limit>'
};

module.exports.run = (client, msg, args) => {
  console.log(args);
  const num1 = parseInt(args[0]);
  const num2 = parseInt(args[1]);

  // Checks if both the numbers are valid
  if (num1 >= 0 && num2 >= 0 && num1 !== num2 && num1 < num2) {
    let randomNum = Math.floor(Math.random() * (num2 - num1)) + num1;
    msg.channel.send({
      content: `I choose ${randomNum} from a range of **${num1}** - **${num2}**`
    }).catch(console.error);
    logger.logSuccessfulCmd(client, msg);
  } else {
    msg.channel.send({
      content: `**${args[0]}** - **${args[1]}** is not a valid range`
    }).catch(console.error);
    logger.logFailedCmd(client, msg);
    return;
  };
};