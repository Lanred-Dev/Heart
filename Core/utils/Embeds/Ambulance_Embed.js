const DiscordAPI = require("discord.js");

module.exports = {
    name: "Ambulance_Embed",

    execute(Status, Footer) {
        return new DiscordAPI.MessageEmbed().setTitle("🚨 [Ambulance Siren] 🚨").setDescription(Status).setColor(Global_Embed_Color).setFooter(`${Footer != null ? Footer : "❤ Invalid Arguments"}`);
    }
};