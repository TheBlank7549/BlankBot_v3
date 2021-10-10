const logger = require('../../functions/logger.js');
const fs = require('fs');

module.exports.info = {
  name: 'showfile',
  aliases: ['sharefile'],
  category: "owner",
  minArgs: 1,
  description: 'Shows specified source files',
  usage: 'showFile <filePath>'
};

module.exports.run = async (client, msg, args) => {
  const path = `src/${args[0]}`;

  // Gets the file name ending with ".js"
  const fileName = path.match(/(\w+.js)$/);

  // Checks if the file exists AND ends in ".js"
  if (!fileName || !fs.existsSync(path)) {
    msg.channel.send({
      content: `\`${args[0]}\` is not a valid js file`
    }).catch(console.error);
    logger.logFailedCmd(client, msg);
    return;
  };

  // Sends the specified file as an attachment
  msg.channel.send({
    files: [
      {
        attachment: path,
        name: fileName[1]
      }
    ]
  }).catch(console.error);
  logger.logSuccessfulCmd(client, msg);
};