const Tips = require(".././Data/Tips.json");

module.exports = {
	name: "Get_Tip",

	execute() {
		return `**${Tips[Math.floor(Math.random() * Tips.length)]}**`;
	},
};
