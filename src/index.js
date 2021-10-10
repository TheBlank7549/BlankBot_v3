// Importing the required node packages
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();

// Importing the event handlers
const msgCreateEvent = require('./events/messageCreate.js');
const readyEvent = require('./events/ready.js');

// Creating the client and required collections
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
client.commands = new Collection();
client.aliases = new Collection();
client.data = new Collection();

// The command loader using fs
require('./functions/commandLoader.js')(client);

// The bot events
client.on('ready', async () => readyEvent(client));
client.on('messageCreate', async msg => msgCreateEvent(client, msg));

// Logging into the account
client.login(process.env.BOTTOKEN);