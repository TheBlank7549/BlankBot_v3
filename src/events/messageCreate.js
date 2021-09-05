module.exports = (client, msg, prefix) => {
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
        };

        try {
            const { minArgs, maxArgs, usage } = command.info
            if (minArgs !== undefined && args.length < minArgs || maxArgs !== undefined && args.length > maxArgs) {
                return msg.channel.send({
                    content: `Incorrect number of arguments provided, correct usage:\n\`${prefix}${usage}\``
                });
            } else {
                command.run(client, msg, args);
            };
        } catch (error) {
            console.log(error);
        };
    };
}