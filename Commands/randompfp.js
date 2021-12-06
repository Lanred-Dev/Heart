const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

function Embed(User, Avatar) {
    const Embed = new Discord.MessageEmbed().setDescription(User).setImage(Avatar).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("randompfp").setDescription("Chooses a random users profile!"),
    category: "fun",

    async execute(Interaction, Client) {
        const Member = Message.guild.members.cache.get(Message.guild.members.cache.random().user.id);

        Interaction.reply({ embeds: [Embed(Member.toString(), Member.user.displayAvatarURL({ format: "jpg" }))] });
    },
};
