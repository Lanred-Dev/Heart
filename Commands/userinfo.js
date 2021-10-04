const DiscordAPI = require("discord.js");
const Get_Member = Global_Functions.Get_Member;

function Format_Date(Date) {
    let Hours = Date.getHours();
    let Minutes = Date.getMinutes();
    let Time_Prefix = Hours >= 12 ? "pm" : "am";
    Hours = Hours % 12;
    Hours = Hours ? Hours : 12;
    Minutes = Minutes < 10 ? `0 ${Minutes}` : Minutes;

    return `${Hours}:${Minutes} ${Time_Prefix}`;
};

function Format_Account_Age(Number_Of_Days) {
    var Years = Math.floor(Number_Of_Days / 365);
    var Months = Math.floor(Number_Of_Days % 365 / 30);
    var Days = Math.floor(Number_Of_Days % 365 % 30);

    return `${Years > 0 ? Years + (Years == 1 ? " year, " : " years, ") : ""}${Months > 0 ? Months + (Months == 1 ? " month, " : " months, ") : ""}${Days > 0 ? Days + (Days == 1 ? " day" : " days") : ""}`;
}

function User_Embed(User, Member, Guild) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(User.tag)
        .setColor(Member.roles.highest.color)
        .setThumbnail(User.avatarURL())
        .addFields({
            name: "Joined Discord",
            value: `${User.createdAt.toLocaleDateString()} at ${Format_Date(User.createdAt)}`,
            inline: true
        }, {
            name: "Account Age",
            value: Format_Account_Age(Math.round(Math.abs((User.createdAt - new Date()) / (24 * 60 * 60 * 1000)))),
            inline: true
        }, {
            name: "Joined Server",
            value: `${Member.joinedAt.toLocaleDateString()} at ${Format_Date(Member.joinedAt)}`,
            inline: true
        }, {
            name: "Server Warns",
            value: Moderation_Database[Guild].warns[User.id] != null ? Moderation_Database[Guild].warns[User.id].amount.toString() : "0",
            inline: true
        }, {
            name: "Highest Role",
            value: Member.roles.highest.toString(),
            inline: true
        })
        .setFooter(`❤ ${User.tag.endsWith("'s") || User.tag.endsWith("'S") ? User.tag : `${User.tag}'s`} info`);

    return Embed;
}

module.exports = {
    name: "userinfo",
    aliases: ["uinfo"],
    category: "utility",
    setup: "userinfo [User]",
    show_aliases: true,
    description: "Yep, this command will display info about the requested user!\nThis command does not take a UserId.",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        Message.channel.send({embeds: [User_Embed(Member.user, Member, Message.guild.id)]});
    }
};