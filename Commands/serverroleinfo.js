const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Role = Global_Functions.Get_Role;

function Embed(Role) {
    const Embed = new Discord.MessageEmbed().setColor(Role.color).setTitle(Role.name).addFields(
        {
            name: "Mentionable",
            value: Role.mentionable.toString(),
            inline: true,
        },
        {
            name: "Hoisted",
            value: Role.hoist.toString(),
            inline: true,
        },
        {
            name: "Permissions",
            value: Role.permissions.toArray().join(", ").toLowerCase().replace(/_/g, " "),
            inline: false,
        }
    );

    return Embed;
}
module.exports = {
    info: new SlashCommandBuilder()
        .setName("serverroleinfo")
        .setDescription("You seen what they have been hiding, now whats that role hiding!")
        .addRoleOption((Option) => Option.setName("role").setDescription("The role").setRequired(true)),
    category: "utility",

    async execute(Interaction, Client) {
        const Role = Get_Role(Interaction);

        if (!Role || Role.deleted === true) return;

        Interaction.reply({ embeds: [Embed(Role)] });
    },
};
