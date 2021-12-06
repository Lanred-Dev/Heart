const fs = require("fs");

module.exports = (Client) => {
    const Files = fs.readdirSync("./Commands/").filter((File) => File.endsWith(".js"));

    for (const File of Files) {
        const Command = require(`../Commands/${File}`);

        if (Command.info) {
            Client.Commands.set(Command.info.name, Command.info.toJSON());
            Client.Commands_Main.set(Command.info.name, Command);
        }
    }
};
