module.exports.info = {
    name: 'reload',
    category: "owner",
    minArgs: 1,
    maxArgs: 1,
    description: 'Reloads a command to implement changes without restarting the bot',
    usage: 'reload <name>'
};

module.exports.run = async (client, msg, args) => {
    // Checks if the command actually exists
    if (!client.commands.has(args[0])) {
        return msg.channel.send({
            content: 'The command could not be found'
        });
    };

    await msg.channel.send({
        content: `Reloading **${args[0]}.js**`
    }).then(m => {
        const target = client.commands.get(args[0]);
        const { name, category } = target.info;
        const targetPath = `../${category}-commands/${name}.js`;
        const newTarget = require(targetPath);

        // Removes the command from the client.commands collection
        delete require.cache[require.resolve(targetPath)];
        client.commands.delete(name);
        // Adds the new command to the client.commands collection
        client.commands.set(name, newTarget);
        m.edit({
            content: `Successfully reloaded **${args[0]}.js**`
        }).catch(console.error);
    });
};