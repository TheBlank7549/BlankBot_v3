module.exports.info = {
  name: 'enable',
  category: "owner",
  minArgs: 2,
  maxArgs: 2,
  description: 'Re-enables a disabled command',
  usage: 'enable <category> <name>'
};

module.exports.run = async (client, msg, args) => {
  // Checks if the command already exists
  if (client.commands.has(args[1])) return msg.channel.send({
    content: 'This command is already enabled'
  });
  const targetPath = `../${args[0]}-commands/${args[1]}.js`;
  let target;

  try {
    target = require(targetPath);
  } catch (error) {
    msg.channel.send({
      content: `**${args[1]}.js** in the **${args[0]}-commands** folder does not exist`
    });
  };

  if (!target) return;
  await msg.channel.send({
    content: `Enabling ${args[1]}.js`
  }).then(m => {
    const { name } = target.info;
    // Adds the new command to the client.commands collection
    client.commands.set(name, target);
    m.edit({
      content: `Successfully enabled **${args[1]}.js**`
    })
  });
};