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
    const num1 = Number(args[0]);
    const num2 = Number(args[1]);
    let randomNum;
    let range;

    // Checks if both the numbers are valid
    if (!num1 || !num2) {
        msg.channel.send({
            content: `**${args[0]}** - **${args[1]}** is not a valid range`
        });
        logger.logFailedCmd(client, msg);
        return;
    };

    // Compares the two numbers and calculates the randomNum, returns if the range isn't valid
    if (num1 === num2) {
        randomNum = num1;
        range = `**${num1}** - **${num1}**`;
    } else if (num1 < num2) {
        randomNum = Math.floor(Math.random() * (num2 - num1)) + num1;
        range = `**${num1}** - **${num2}**`;
    } else if (num1 > num2) {
        msg.channel.send({
            content: `**${num1}** - **${num2}** is not a valid range`
        });
        logger.logFailedCmd(client, msg);
        return;
    };

    msg.channel.send({
        content: `Given range: ${range},\nSo I choose ${randomNum}`
    });
    logger.logSuccessfulCmd(client, msg);
};