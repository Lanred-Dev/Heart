const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;
const Get_Member_Roles = Global_Functions.Get_Member_Roles;

function Format_Date(Date) {
    let Hours = Date.getHours();
    let Minutes = Date.getMinutes();
    let Time_Prefix = Hours >= 12 ? "pm" : "am";
    Hours = Hours % 12;
    Hours = Hours ? Hours : 12;
    Minutes = Minutes < 10 ? `0 ${Minutes}` : Minutes;

    return `${Hours}:${Minutes} ${Time_Prefix}`;
}

function Format_Account_Age(Number_Of_Days) {
    let Years = Math.floor(Number_Of_Days / 365);
    let Months = Math.floor((Number_Of_Days % 365) / 30);
    let Days = Math.floor((Number_Of_Days % 365) % 30);

    return `${Years > 0 ? Years + (Years == 1 ? " year, " : " years, ") : ""}${Months > 0 ? Months + (Months == 1 ? " month, " : " months, ") : ""}${Days > 0 ? Days + (Days == 1 ? " day" : " days") : ""}`;
}

function Embed(User, Member, Guild) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(User.tag)
        .setColor(Member.roles.highest.color)
        .setThumbnail(User.avatarURL())
        .addFields(
            {
                name: "Joined Discord",
                value: `${User.createdAt.toLocaleDateString()} at ${Format_Date(User.createdAt)}`,
                inline: true,
            },
            {
                name: "Account Age",
                value: Format_Account_Age(Math.round(Math.abs((User.createdAt - new Date()) / (24 * 60 * 60 * 1000)))),
                inline: true,
            },
            {
                name: "Joined Server",
                value: `${Member.joinedAt.toLocaleDateString()} at ${Format_Date(Member.joinedAt)}`,
                inline: true,
            },
            {
                name: "Warns",
                value: Global_Databases.Moderation[Guild.id].warns[User.id] ? Global_Databases.Moderation[Guild.id].warns[User.id].amount.toString() : "0",
                inline: true,
            },
            {
                name: "Highest Role",
                value: Member.roles.highest.toString(),
                inline: true,
            },
            {
                name: "Server Roles",
                value: Get_Member_Roles(Member, Guild, 5),
                inline: false,
            }
        )
        .setFooter(`❤ ${User.tag.endsWith("'s") || User.tag.endsWith("'S") ? User.tag : `${User.tag}'s`} info`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Yep, this command will display info about the requested user!")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "utility",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false);

        if (!Member) return;

        Interaction.reply({ embeds: [Embed(Member.user, Member, Interaction.guild)] });
    },
};
