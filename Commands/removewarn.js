const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Remove_Warn_Embed(Reason, Warn, Admin, Server) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:")
        .setDescription(`One of your warns have been removed in **${Server}**.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Moderator",
            value: Admin,
            inline: true
        }, {
            name: "Warn",
            value: Warn,
            inline: true
        }, {
            name: "Warn Reason",
            value: Reason,
            inline: true
        });

    return Embed;
}

function Log_Embed(Reason, Warn, User, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`Warn ${Warn} has been removed from ${User} by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Warn Reason",
            value: Reason,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "removewarn",
    aliases: [],
    category: "moderation",
    setup: "removewarn [User] [Key]",
    show_aliases: true,
    description: "Dont want a user to have a warn, I see.",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;

        var Warn_Key = Message_Args[1];

        if (Warn_Key.toLowerCase() === "key") {
            Warn_Key = Message_Args[2];
        };

        var Warn = Moderation_Database[Message.guild.id].warns[Member.id].warns[Warn_Key];

        if (!Warn) return Message.channel.send({
            embeds: [Ambulance_Embed(`I cant find that **warn** for ${Member.toString()}.`)]
        });

        Warn_Key.toLowerCase() === "key" || Warn_Key.toLowerCase() === "warn" ? Warn_Key = Message_Args[2] : null;
        Warn_Key.toLowerCase() === "key" || Warn_Key.toLowerCase() === "warn" ? Warn_Key = Message_Args[3] : null;

        Member.send({
            embeds: [Remove_Warn_Embed(Warn.reason, Warn_Key, Message.author.toString(), Message.guild.name)]
        }).catch();

        Message.channel.send({
            embeds: [
                new DiscordAPI.MessageEmbed()
                .setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:")
                .setDescription(`${Member.toString()}'s warn has been removed.`)
                .setColor("#FF2D00")
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embeds: [Log_Embed(Warn.reason, Warn_Key, Member.tag, Message.author.toString())]
        });

        Moderation_Database[Message.guild.id].warns[Member.id].amount -= 1;
        delete Moderation_Database[Message.guild.id].warns[Member.id].warns[Warn_Key];
    }
};