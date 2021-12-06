const fs = require("fs");

module.exports = (Client) => {
    function Load(Directory) {
        const Files = fs.readdirSync(`./Core/Events/${Directory}`).filter((File) => File.endsWith(".js"));

        for (const File of Files) {
            const Event = require(`../Core/Events/${Directory}/${File}`);
            const Name = File.split(".")[0];

            Client.on(Name, Event.bind(null, Client));
        }
    }

    ["Client", "Guild"].forEach((Directory) => Load(Directory));
};
