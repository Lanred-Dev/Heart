const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Kick_Embed(Reason, Admin, Server) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🚨 [Police Siren] 🚨")
        .setDescription(`You have been kicked from **${Server}**.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Moderator",
            value: Admin,
            inline: true
        }, {
            name: "Reason",
            value: Reason,
            inline: true
        });

    return Embed;
}

function Log_Embed(Reason, User, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${User} has been kicked by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Reason",
            value: Reason,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "kick",
    aliases: ["bouncer"],
    category: "moderation",
    setup: "kick [User] [Reason]",
    show_aliases: true,
    permissions: ["ADMINISTRATOR", "KICK_MEMBERS"],
    description: "Will kick a user from the server.",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (Member === Message.member) return Message.channel.send({
            embeds: [Ambulance_Embed("You cant kick yourself.")]
        });
        if (Member.hasPermission("ADMINISTRATOR")) return Message.channel.send({
            embeds: [Ambulance_Embed("I cant kick fellow admins.")]
        });

        var Reason = Message_Args.slice(1).join(" ");

        if (!Reason) Reason = "No reason";

        Member.send({
            embeds: [Kick_Embed(Reason, Message.author.toString(), Message.guild.name)]
        }).catch();

        setTimeout(function () {
            Member
                .kick({
                    reason: `Was kicked by: ${Message.author.name}`
                })
                .then(() => {
                    Message.channel.send({
                        embeds: [
                            new DiscordAPI.MessageEmbed()
                            .setTitle("🚨 [Police Siren] 🚨")
                            .setDescription(`${Member.toString()} has been kicked.`)
                            .setColor(Global_Embed_Color)
                        ]
                    });

                    const Log_Channel = Get_Server_Log_Channel(Message.guild);

                    if (Log_Channel) Log_Channel.send({
                        embeds: [Log_Embed(Reason, Member.tag, Message.author.toString())]
                    });
                })
                .catch(Error => {
                    console.log(`Failed to kick user.\nError: ${Error}`);
                    Message.channel.send({
                        embeds: [Ambulance_Embed("Sorry, but I ran into an error.")]
                    });
                });
        }, 1000);
    }
};