const DiscordAPI = require("discord.js");

module.exports = {
    name: "Currency_Disabled_Ambulance_Embed",

    execute() {
        return new DiscordAPI.MessageEmbed().setTitle(":lock: [Locked noises] :lock:").setDescription("Currency has been disabled in this server.").setColor(Global_Embed_Color);
    }
};