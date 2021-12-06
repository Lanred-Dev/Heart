const Discord = require("discord.js");

module.exports = {
	name: "Base_Embed",

	execute(Status) {
		return new Discord.MessageEmbed().setDescription(Status).setColor(Global_Embed_Color);
	},
};
