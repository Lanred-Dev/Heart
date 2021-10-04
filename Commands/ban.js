const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Ban_Embed(Reason, Moderator, Appeal_Statement, Server) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🚨 [Police Siren] 🚨")
        .setDescription(`You have been banned from **${Server}** by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .setFooter(Appeal_Statement)
        .addFields({
            name: "Reason",
            value: Reason,
            inline: true
        });

    return Embed;
}

function Log_Embed(Reason, User, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${User} has been banned by ${Moderator}.`)
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
    name: "ban",
    aliases: ["permbounce"],
    category: "moderation",
    setup: "ban [User] [Reason]",
    show_aliases: true,
    permissions: ["ADMINISTRATOR", "BAN_MEMBERS"],
    description: "Will ban a user from the server.",

    async execute(Message, Message_Args, Client, Command) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (Member === Message.member) return Message.channel.send({
            embeds: [Ambulance_Embed("You cant ban yourself.")]
        });
        if (Member.hasPermission("ADMINISTRATOR")) return Message.channel.send({
            embeds: [Ambulance_Embed("I cant ban fellow admins.")]
        });

        const Reason = Message_Args.slice(1).join(" ") || "No Reason";
        const Appeal_Statement = Moderation_Database[Member.guild.id].appeal_statement || "No appeal statement";

        Member.send({
            embeds: [Ban_Embed(Reason, Message.author.tag, Appeal_Statement, Message.guild.name)]
        }).catch();

        setTimeout(function () {
            Member
                .ban({
                    reason: Reason
                })
                .then(() => {
                    Message.channel.send({
                        embeds: [
                            new DiscordAPI.MessageEmbed()
                            .setTitle("🚨 [Police Siren] 🚨")
                            .setDescription(`${Member.toString()} has been banned.`)
                            .setColor(Global_Embed_Color)
                        ]
                    });

                    const Log_Channel = Get_Server_Log_Channel(Message.guild);

                    if (Log_Channel) {
                        Log_Channel.send({
                            embeds: [Log_Embed(Reason, Member.tag, Message.author.toString())]
                        });
                    }
                })
                .catch(Error => {
                    console.log(`Failed to ban user.\nError: ${Error}`);
                    Message.channel.send({
                        embeds: [Ambulance_Embed("Sorry, but I ran into an error.")]
                    });
                });
        }, 1000);
    }
};