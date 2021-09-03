const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

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

            const jsfiles = files.filter(f => f.endsWith('.js'));
            if (jsfiles.length <= 0) {
                console.log(`No commands found in ${commandFolder}`);
                return;
            }

            jsfiles.forEach(jsfile => {
                console.log(jsfile);
                const cmd = require(`./commands/${commandFolder}/${jsfile}`);
                client.commands.set(cmd.info.name, cmd);
                cmd.info.aliases.forEach(alias => {
                    client.aliases.set(alias, cmd.info.name);
                })
                console.log(`${jsfile} loaded!`);
            });
        });
    });
});

client.on('ready', async () => {
    console.log('BlankBot_v3 is now online');
});

client.login(process.env.BOTTOKEN);