const fsAPI = require("fs");

module.exports = (Client) => {
    const Files = fsAPI.readdirSync("./Commands/").filter(File => File.endsWith(".js"));

    for (const File of Files) {
        const Command = require(`../Commands/${File}`);

        if (Command.name != null && Command.name != "") {
            Client.Commands.set(Command.name, Command);
        }
    };
};