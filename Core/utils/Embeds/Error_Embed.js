const Discord = require("discord.js");

module.exports = {
    name: "Error_Embed",

    execute(Error, Status) {
        return new Discord.MessageEmbed()
            .setTitle(":octagonal_sign: 500 Interal Server Error :octagonal_sign:")
            .setDescription(`${Status ? Status : "Oops! We failed to process that."}`)
            .addFields({
                name: "Error",
                value: Error ? Error : "No error info",
                inline: true,
            })
            .setColor(Global_Embed_Color);
    },
};
