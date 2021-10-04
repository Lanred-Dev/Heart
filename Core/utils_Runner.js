const fsAPI = require("fs");

module.exports = () => {
    const Files = {};
    const Functions = fsAPI.readdirSync("./Core/utils/Functions").filter(File => File.endsWith(".js"));
    const Embeds = fsAPI.readdirSync("./Core/utils/Embeds").filter(File => File.endsWith(".js"));

    for (const File of Embeds) {
        const Embed = require(`../Core/utils/Embeds/${File}`);

        if (Embed.name != null && Embed.name != "" && Files[Embed.name] == null) {
            Files[Embed.name] = Embed.execute;
        }
    };

    for (const File of Functions) {
        const Function = require(`../Core/utils/Functions/${File}`);

        if (Function.name != null && Function.name != "" && Files[Function.name] == null) {
            Files[Function.name] = Function.execute;
        }
    };

    return Files;
};