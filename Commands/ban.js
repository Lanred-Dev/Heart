const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Error_Embed = Global_Functions.Error_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Ban_Embed(Reason, Moderator, Server) {
    const Embed = new Discord.MessageEmbed().setTitle("🚨 [Police Siren] 🚨").setDescription(`You have been banned from **${Server}** by ${Moderator}.`).setColor(Global_Embed_Color).addFields({
        name: "Reason",
        value: Reason,
        inline: true,
    });

    return Embed;
}

function Log_Embed(Reason, User, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${Moderator} banned ${User}.`)
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
        .setName("ban")
        .setDescription("Will ban a user from the server.")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(true))
        .addStringOption((Option) => Option.setName("reason").setDescription("The ban reason").setRequired(false)),
    category: "moderation",
    permissions: ["ADMINISTRATOR", "BAN_MEMBERS"],

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, false, true, "you cant ban yourself", "you cant ban fellow admins", true);

        if (!Member) return;

        const Reason = Interaction.options.getString("reason") || "No Reason";

        try {
            Member.send({ embeds: [Ban_Embed(Reason, Interaction.user.tag, Interaction.guild.name)] });
        } catch (Error) {}

        setTimeout(function () {
            Member.ban({
                reason: Reason,
            })
                .then(() => {
                    Interaction.reply({
                        embeds: [new Discord.MessageEmbed().setTitle("🚨 [Police Siren] 🚨").setDescription(`${Member.toString()} has been banned.`).setColor(Global_Embed_Color)],
                    });

                    const Log_Channel = Get_Server_Log_Channel(Interaction.guild);

                    if (Log_Channel) Log_Channel.send({ embeds: [Log_Embed(Reason, Member.tag, Interaction.user.toString())] });
                })
                .catch((Error) => {
                    console.log(`Failed to ban user.\nError: ${Error}`);

                    Interaction.reply({ embeds: [Error_Embed(Error)] });
                });
        }, 1000);
    },
};
