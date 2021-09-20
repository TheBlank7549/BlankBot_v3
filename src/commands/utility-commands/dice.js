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
    });

    let randomNum = Math.ceil(Math.random() * multiplier);
    msg.channel.send({
        content: `**${msg.author.username}** rolled a ${multiplier} sided dice\nIt rolled a **${randomNum}**`
    });
    logger.logSuccessfulCmd(client, msg);
};