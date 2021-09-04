const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const { defaultPrefix } = require('../config.json');
let prefix = defaultPrefix;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.commands = new Collection();
client.aliases = new Collection();

fs.readdir('./src/commands', (err, commandFolders) => {
    if (err) console.log(err);

    commandFolders.forEach(commandFolder => {
        fs.readdir(`./src/commands/${commandFolder}`, (err, files) => {
            if (err) console.log(err);

            console.log(`Loading files from ${commandFolder}`);
            const jsfiles = files.filter(f => f.endsWith('.js'));
            if (jsfiles.length <= 0) {
                return console.log(`No commands found in ${commandFolder}`);
            };

            jsfiles.forEach(jsfile => {
                const cmd = require(`./commands/${commandFolder}/${jsfile}`);
                client.commands.set(cmd.info.name, cmd);
                if (cmd.info.aliases) {
                    cmd.info.aliases.forEach(alias => {
                        client.aliases.set(alias, cmd.info.name);
                    });
                };
                console.log(`${jsfile} loaded!`);
            });
        });
    });
});

client.on('ready', async () => {
    console.log('BlankBot_v3 is now online');
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    if (msg.author.id === client.user.id) return;


    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).toLowerCase().trim().split(/ /g);
        const cmdUsed = args.shift();
        let command;

        if (client.commands.has(cmdUsed)) {
            command = client.commands.get(cmdUsed);
        } else if (client.aliases.has(cmdUsed)) {
            command = client.commands.get(client.aliases.get(cmdUsed));
        } else {
            return;
        }

        try {
            const { minArgs, maxArgs, usage } = command.info
            if (minArgs !== undefined && args.length < minArgs || maxArgs !== undefined && args.length > maxArgs) {
                return msg.channel.send({
                    content: `Incorrect number of arguments provided, correct usage:\n\`${prefix}${usage}\``
                })
            } else {
                command.run(client, msg, args);
            }
        } catch (error) {
            console.log(error);
        };
    };
});

client.login(process.env.BOTTOKEN);