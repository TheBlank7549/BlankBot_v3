const logger = require('../../functions/logger.js');
const delayConverter = require('../../functions/delayConverter.js');

module.exports.info = {
    name: 'remindme',
    aliases: ['reminder'],
    category: "utility",
    minArgs: 1,
    description: 'Sets a simple reminder',
    usage: 'remindme <duration> [msg]'
};

module.exports.run = async (client, msg, args) => {
    // Initializes the delay and msg
    const delayTime = args.shift();
    const delay = delayConverter.toMS(delayTime);
    let message = '';

    // Returns if the delay isn't valid
    if (!delay) {
        msg.channel.send({
            content: `\`${delayTime}\` is not a valid duration`
        }).catch(console.error);
        logger.logFailedCmd(client, msg);
        return;
    };

    // Prepares the reminder msg, if one is prepared
    if (args.length > 0) {
        message = ` to **${msg.content.split(/ +/g).slice(2).join(' ')}**`;
    };

    // Marks the start of the timer and says how long is left
    await msg.channel.send({
        content: `Oki, I will remind you in ${delay.properTime}`
    }).then(m => {
        logger.logSuccessfulCmd(client, msg);
        // Reminds after the set duration
        setTimeout(() => {
            m.reply({
                content: `<@${msg.author.id}>, it is time${message}`
            })
        }, delay.msTime);
    }).catch(console.error);
};