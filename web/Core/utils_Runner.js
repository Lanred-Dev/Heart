const fsAPI = require("fs");

module.exports = () => {
    const Files = {};
    const Functions = fsAPI.readdirSync("./web/Core/utils").filter(File => File.endsWith(".js"));

    for (const File of Functions) {
        const Function = require(`../../web/Core/utils/${File}`);

        if (Function.name != null && Function.name != "" && Files[Function.name] == null) {
            Files[Function.name] = Function.execute;
        }
    };

    return Files;
};