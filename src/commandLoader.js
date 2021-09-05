const fs = require('fs');
module.exports = client => {
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
}