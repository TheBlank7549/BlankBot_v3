module.exports.info = {
    name: 'ping',
    aliases: [],
    minArgs: 0,
    maxArgs: 99,
};

module.exports.run = async (client, msg, args) => {
    await msg.channel.send({
        content: 'Ping?'
    }).then(m => {
        m.edit({
            content: `Pong, but \`${m.createdTimestamp - msg.createdTimestamp}ms\` later!`
        });
    });
};

module.exports.argsErr = (msg, prefix) => {
    msg.channel.send({
        content: `${prefix}ping`
    });
};