const Discord = require("discord.js");
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Error_Embed = Global_Functions.Error_Embed;
const Base_Embed = Global_Functions.Base_Embed;

function Embed(Fact, Image) {
    const Embed = new Discord.MessageEmbed().setDescription(Fact).setImage(Image).setColor(Global_Embed_Color).setFooter(`❤ Data provided by https://some-random-api.ml`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("dogfact").setDescription("dogs, yes, dogs"),
    category: "fun",
    cooldown: 5000,

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Base_Embed("Please wait...")] });

        try {
            const Response = await fetch("https://some-random-api.ml/animal/dog");
            const JSON_Response = await Response.json();

            Interaction.editReply({
                embeds: [Embed(JSON_Response.fact, JSON_Response.image)],
            });
        } catch (Error) {
            Interaction.editReply({ embeds: [Error_Embed(Error)] });
        }
    },
};
