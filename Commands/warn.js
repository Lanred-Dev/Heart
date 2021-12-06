const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Warn_Container = require("../Core/utils/Data/Constructors/Warn_Container.js");
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;
const Moderation_Database = Global_Databases.Moderation;

function Warn_Embed(Reason, Moderator, Server) {
    const Embed = new Discord.MessageEmbed().setTitle("🚨 [Police Siren] 🚨").setDescription(`You have been warned in **${Server}** by ${Moderator}.`).setColor(Global_Embed_Color).addFields({
        name: "Reason",
        value: Reason,
        inline: true,
    });

    return Embed;
}

function Log_Embed(Reason, User, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${Moderator} warned ${User}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Reason",
            value: Reason,
            inline: true,
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("This command will warn a user!")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(true))
        .addStringOption((Option) => Option.setName("reason").setDescription("The warn reason").setRequired(false)),
    category: "moderation",
    permissions: "ADMINISTRATOR",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, false, true, "you cant warn yourself", "you cant warn fellow admins", true);

        if (!Member) return;
        if (!Moderation_Database[Interaction.guild.id].warns[Member.id]) Moderation_Database[Interaction.guild.id].warns[Member.id] = Warn_Container;

        const Reason = Interaction.options.getString("reason") || "No reason";
        const Highest_Key = Math.max.apply(null, Object.keys(Moderation_Database[Interaction.guild.id].warns[Member.id].warns));

        try {
            Member.send({ embeds: [Warn_Embed(Reason, `${Interaction.user.username}#${Interaction.user.discriminator}`, Interaction.guild.name)] });
        } catch (Error) {}

        Interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("🚨 [Police Siren] 🚨").setDescription(`${Member.toString()} has been warned.`).setColor(Global_Embed_Color)], ephemeral: true });

        const Log_Channel = Get_Server_Log_Channel(Interaction.guild);

        if (Log_Channel) Log_Channel.send({ embeds: [Log_Embed(Reason, Member.tag, Interaction.user.toString())] });

        Moderation_Database[Interaction.guild.id].warns[Member.id].warns[Highest_Key && Highest_Key > 0 ? Highest_Key + 1 : 1] = { moderator: Interaction.user.id, reason: Reason };
    },
};
