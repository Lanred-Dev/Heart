const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Tip = Global_Functions.Get_Tip;

function Embed(API_Latency) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("💬 [Server Sounds] 💬")
        .setColor(Global_Embed_Color)
        .addFields({
            name: "API Latency",
            value: `${API_Latency}ms`,
            inline: true,
        });

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Will list the API Latency of the bot."),
    category: "utility",

    async execute(Interaction, Client) {
        Interaction.reply({ content: Get_Tip(), embeds: [Embed(Math.round(Client.ws.ping))] });
    },
};
