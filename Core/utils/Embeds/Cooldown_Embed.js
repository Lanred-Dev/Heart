const Discord = require("discord.js");

module.exports = {
	name: "Cooldown_Embed",

	execute(Status) {
		return new Discord.MessageEmbed().setTitle(":octagonal_sign: [Braking noises] :octagonal_sign:").setDescription(Status).setColor(Global_Embed_Color);
	},
};
