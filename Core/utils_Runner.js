const fs = require("fs");

module.exports = () => {
    const Files = {};
    const Functions = fs.readdirSync("./Core/utils/Functions").filter((File) => File.endsWith(".js"));
    const Embeds = fs.readdirSync("./Core/utils/Embeds").filter((File) => File.endsWith(".js"));

    for (const File of Embeds) {
        const Embed = require(`../Core/utils/Embeds/${File}`);

        if (Embed.name && Embed.name != "" && Files[Embed.name] == null) {
            Files[Embed.name] = Embed.execute;
        }
    }

    for (const File of Functions) {
        const Function = require(`../Core/utils/Functions/${File}`);

        if (Function.name && Function.name != "" && Files[Function.name] == null) {
            Files[Function.name] = Function.execute;
        }
    }

    return Files;
};
