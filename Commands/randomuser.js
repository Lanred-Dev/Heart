const { SlashCommandBuilder } = require("@discordjs/builders");
const Embed = Global_Functions.Base_Embed;

module.exports = {
    info: new SlashCommandBuilder().setName("randomuser").setDescription("Chooses a random user!"),
    category: "fun",

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Embed(Message.guild.members.cache.get(Message.guild.members.cache.random().user.id).tag)] });
    },
};
