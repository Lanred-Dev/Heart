const fs = require("fs");

module.exports = {
	name: "Get_oauth_Database_User",

	execute(ID) {
		return JSON.parse(fs.readFileSync("web/Core/Databases/oauth.json")).find(User => User.id === ID);
	},
};
