const { SlashCommandBuilder } = require("@discordjs/builders");
const Embed = Global_Functions.Base_Embed;
const Get_Tip = Global_Functions.Get_Tip;

module.exports = {
    info: new SlashCommandBuilder()
        .setName("hentai")
        .setDescription("..."),
    category: "meme",

    async execute(Interaction, Client) {
        Interaction.reply({ content: Get_Tip(), embeds: [Embed(`${Interaction.user.toString()}, dude wtf`)] });
    },
};
