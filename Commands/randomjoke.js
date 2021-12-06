const Discord = require("discord.js");
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Error_Embed = Global_Functions.Error_Embed;
const Base_Embed = Global_Functions.Base_Embed;

function Embed(Message) {
    const Embed = new Discord.MessageEmbed().setDescription(Message).setFooter("❤ Jokes provided by https://icanhazdadjoke.com").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("randomjoke").setDescription("HAHAHAHAHA JOKE = FUNNY!!!"),
    category: "fun",
    cooldown: 5000,

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Base_Embed("Please wait...")] });

        try {
            const Response = await fetch("https://icanhazdadjoke.com", {
                headers: {
                    Accept: "application/json",
                },
            });
            const JSON_Response = await Response.json();

            Interaction.editReply({ embeds: [Embed(JSON_Response.joke)] });
        } catch (Error) {
            Interaction.editReply({ embeds: [Error_Embed(Error)] });
        }
    },
};
