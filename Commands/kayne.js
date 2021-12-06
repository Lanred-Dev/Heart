const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Tip = Global_Functions.Get_Tip;

function Embed() {
    const Embed = new Discord.MessageEmbed().setDescription("dont worry kanye we love you").setImage("https://i.kym-cdn.com/entries/icons/original/000/033/421/cover2.jpg").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("kayne")
        .setDescription("kayne west kayne west kayne west kayne west kayne west kayne west"),
    category: "meme",

    async execute(Interaction, Client) {
        Interaction.reply({ content: Get_Tip(), embeds: [Embed()] });
    },
};
