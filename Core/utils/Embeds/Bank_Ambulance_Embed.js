const Discord = require("discord.js");

module.exports = {
	name: "Bank_Ambulance_Embed",

	execute(Status) {
		return new Discord.MessageEmbed().setTitle(":bank: [Bank noises] :bank:").setDescription(Status).setColor(Global_Embed_Color);
	},
};
