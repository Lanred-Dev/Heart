const fs = require("fs");

module.exports = () => {
	const Files = {};
	const Functions = fs.readdirSync("./web/Core/utils").filter((File) => File.endsWith(".js"));

	for (const File of Functions) {
		const Function = require(`../../web/Core/utils/${File}`);

		if (Function.name && Function.name != "" && Files[Function.name] == null) {
			Files[Function.name] = Function.execute;
		}
	}

	return Files;
};
