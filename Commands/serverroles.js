const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Server_Roles = Global_Functions.Get_Server_Roles;

function Embed(Guild, Role_Count) {
    const Embed = new Discord.MessageEmbed().setColor(Guild.roles.highest.color).setDescription(Get_Server_Roles(Guild, 1000)).setFooter(`${Guild.name} has ${Role_Count} roles`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("serverroles")
        .setDescription("What are they hiding?"),
    category: "utility",

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Embed(Interaction.guild, Interaction.guild.roles.cache.filter((Role) => Role.deleted == false).size.toString())] });
    },
};
