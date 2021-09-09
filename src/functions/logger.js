const { MessageEmbed } = require('discord.js');

// Logs bot startup times to a fixed channel
module.exports.logStartup = async client => {
    const logChannel = client.channels.cache.find(ch => ch.id === '885581415792668742');

    const logEmbed = new MessageEmbed()
        .setTitle('<:successful:871123822596743250> Successful Startup')
        .setTimestamp();

    logChannel.send({
        embeds: [logEmbed]
    });
};

// Logs successful commands to a fixed channel
module.exports.logSuccessfulCmd = async (client, msg) => {
    const { author, channel, guild, content } = msg;
    const logChannel = client.channels.cache.find(ch => ch.id === '884716667060502588');

    const logEmbed = new MessageEmbed()
        .setTitle('<:successful:871123822596743250> Successful command')
        .addFields(
            {
                name: 'Who?',
                value: author.tag
            },
            {
                name: 'Where?',
                value: `"${channel.name}" of "${guild.name}"`
            },
            {
                name: 'What?',
                value: content
            }
        )
        .setTimestamp();

    logChannel.send({
        embeds: [logEmbed]
    });
};

// Logs unsuccessful commands to a fixed channel
module.exports.logFailedCmd = async (client, msg) => {
    const { author, channel, guild, content } = msg;
    const logChannel = client.channels.cache.find(ch => ch.id === '884716667060502588');

    const logEmbed = new MessageEmbed()
        .setTitle('<:unsuccessful:871123822634483732> Failed command')
        .addFields(
            {
                name: 'who?',
                value: author.tag
            },
            {
                name: 'where?',
                value: `"${channel.name}" of "${guild.name}"`
            },
            {
                name: 'what?',
                value: content
            }
        )
        .setTimestamp();

    logChannel.send({
        embeds: [logEmbed]
    });
};