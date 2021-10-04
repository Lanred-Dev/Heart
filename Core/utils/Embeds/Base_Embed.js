const DiscordAPI = require("discord.js");

module.exports = {
    name: "Base_Embed",

    execute(Status) {
        return new DiscordAPI.MessageEmbed().setDescription(Status).setColor(Global_Embed_Color);
    }
};