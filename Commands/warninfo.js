const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;

function Warn_Embed(Warn_String) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":notepad_spiral: [Police Logs] :notepad_spiral:")
        .setDescription(Warn_String)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Load_Warn(User, Warn, Warn_Number) {
    return `Here is **warn ${Warn_Number}** for ${User.toString()}.\n\nModerator: ${Warn.moderator.toString()}\nReason: ${Warn.reason}`;
}

module.exports = {
    name: "warninfo",
    aliases: ["winfo"],
    category: "moderation",
    setup: "warninfo [User] [Key]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Will list the info of the requested warn.",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (!Moderation_Database[Message.guild.id].warns[Member.id]) Moderation_Database[Message.guild.id].warns[Member.id] = {
            warns: {},
            amount: 0
        };

        var Warn_Key = Message_Args[1];

        if (!Warn_Key) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid warn key for ${Member.toString()}.`)]});

        Warn_Key.toLowerCase() === "key" || Warn_Key.toLowerCase() === "warn" ? Warn_Key = Message_Args[2] : null;
        Warn_Key.toLowerCase() === "key" || Warn_Key.toLowerCase() === "warn" ? Warn_Key = Message_Args[3] : null;

        const Warn = Moderation_Database[Message.guild.id].warns[Member.id].warns[Warn_Key];

        if (Warn) {
            Message.channel.send({embeds: [Warn_Embed(Load_Warn(Member, Warn, Warn_Key))]});
        } else {
            Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, that is not a valid warn key for ${Member.toString()}.`)]});
        };
    }
};