const DiscordAPI = require("discord.js");
const Get_Member = Global_Functions.Get_Member;

function Warns_Embed(Warn_String) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":notepad_spiral: [Police Logs] :notepad_spiral:")
        .setDescription(Warn_String)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Load_Warns(User, User_Warns, Start_Amount, End_Amount) {
    var String = `${User} has ${User_Warns.amount === 1 ? `**${User_Warns.amount}** warn` : `**${User_Warns.amount}** warns`}.`;

    for (var Current_Warn = Start_Amount; Current_Warn < End_Amount; Current_Warn++) {
        if (User_Warns.warns[Current_Warn] != null) {
            String = `${String}\n\n**Warn ${Current_Warn}**\nReason: ${User_Warns.warns[Current_Warn].reason}\nModerator: ${User_Warns.warns[Current_Warn].moderator}`;
        }
    };

    return String;
}

module.exports = {
    name: "warns",
    aliases: ["infractions", "uwarns", "userwarns"],
    category: "moderation",
    setup: "warns [User]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Will list a users warns!",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (!Moderation_Database[Message.guild.id].warns[Member.id]) Moderation_Database[Message.guild.id].warns[Member.id] = {
            warns: {},
            amount: 0
        };

        Message.channel.send({embeds: [Warns_Embed(Load_Warns(Member.toString(), Moderation_Database[Message.guild.id].warns[Member.id], 0, 10))]});
    }
};