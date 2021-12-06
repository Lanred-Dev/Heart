const Discord = require("discord.js");

module.exports = {
	name: "Ambulance_Embed",

	execute(Status, Footer) {
		return new Discord.MessageEmbed()
			.setTitle("🚨 [Ambulance Siren] 🚨")
			.setDescription(Status)
			.setColor(Global_Embed_Color)
			.setFooter(`${Footer ? Footer : "❤ Invalid Arguments"}`);
	},
};
