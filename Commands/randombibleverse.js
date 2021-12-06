const Discord = require("discord.js");
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Error_Embed = Global_Functions.Error_Embed;

function Embed(Verse, Title) {
    const Embed = new Discord.MessageEmbed().setTitle(`:book: ${Title} :book:`).setDescription(Verse).setColor(Global_Embed_Color).setFooter(`❤ Data provided by https://bible.org`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("randombibleverse").setDescription("A random bible verse! wow!"),
    category: "fun",
    cooldown: 5000,

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Base_Embed("Please wait...")] });

        try {
            const Response = await fetch("https://labs.bible.org/api/?passage=random&type=json");
            const JSON_Response = await Response.json();

            Interaction.editReply({ embeds: [Embed(JSON_Response[0].text, `${JSON_Response[0].bookname} ${JSON_Response[0].chapter}:${JSON_Response[0].verse}`)] });
        } catch (Error) {
            Interaction.editReply({ embeds: [Error_Embed(Error)] });
        }
    },
};
