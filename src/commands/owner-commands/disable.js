module.exports.info = {
    name: 'disable',
    category: "owner",
    minArgs: 1,
    maxArgs: 1,
    description: 'Temporarily disables a command',
    usage: 'disable <name>'
};

module.exports.run = async (client, msg, args) => {
    // Checks if the command actually exists
    if (!client.commands.has(args[0])) {
        return msg.channel.send({
            content: 'The command could not be found'
        });
    };

    await msg.channel.send({
        content: `Disbling **${args[0]}.js**`
    }).then(m => {
        const target = client.commands.get(args[0]);
        const { name, category } = target.info;
        const targetPath = `../${category}-commands/${name}.js`;

        // Removes the command from the client.commands collection
        delete require.cache[require.resolve(targetPath)];
        client.commands.delete(name);
        m.edit({
            content: `Successfully disabled **${args[0]}.js**`
        }).catch(console.error);
    });
};