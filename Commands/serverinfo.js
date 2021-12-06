const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Server_Roles = Global_Functions.Get_Server_Roles;

function Format_Date(Date) {
    let Hours = Date.getHours();
    let Minutes = Date.getMinutes();
    const Time_Prefix = Hours >= 12 ? "pm" : "am";
    Hours = Hours % 12;
    Hours = Hours ? Hours : 12;
    Minutes = Minutes < 10 ? `0${Minutes}` : Minutes;

    return `${Hours}:${Minutes} ${Time_Prefix}`;
}

function Format_Server_Age(Number_Of_Days) {
    let Years = Math.floor(Number_Of_Days / 365);
    let Months = Math.floor((Number_Of_Days % 365) / 30);
    let Days = Math.floor((Number_Of_Days % 365) % 30);

    return `${Years > 0 ? Years + (Years == 1 ? " year, " : " years, ") : ""}${Months > 0 ? Months + (Months == 1 ? " month, " : " months, ") : ""}${Days > 0 ? Days + (Days == 1 ? " day" : " days") : ""}`;
}

function Embed(Guild, Text_Channel_Count, Voice_Channel_Count, Role_Count, Users_Online, Server_Icon, Bot_Count) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(Guild.name)
        .setColor(Guild.roles.highest.color)
        .addFields(
            {
                name: "Guild Created",
                value: `${Guild.createdAt.toLocaleDateString()} at ${Format_Date(Guild.createdAt)}`,
                inline: true,
            },
            {
                name: "Guild Age",
                value: `${Format_Server_Age(Math.round(Math.abs((Guild.createdAt - new Date()) / (24 * 60 * 60 * 1000))))}`,
                inline: true,
            },
            {
                name: "User Count",
                value: Guild.memberCount.toString(),
                inline: true,
            },
            {
                name: "Users Online",
                value: `${Users_Online}/${Guild.memberCount.toString()}`,
                inline: true,
            },
            {
                name: "Bot Count",
                value: Bot_Count,
                inline: true,
            },
            {
                name: "Text Channel Count",
                value: Text_Channel_Count,
                inline: true,
            },
            {
                name: "Voice Channel Count",
                value: Voice_Channel_Count,
                inline: true,
            },
            {
                name: "Role Count",
                value: Role_Count,
                inline: true,
            },
            {
                name: "Highest Role",
                value: Guild.roles.highest.toString(),
                inline: true,
            },
            {
                name: "Roles",
                value: Get_Server_Roles(Guild, 5),
                inline: false,
            }
        )
        .setThumbnail(Server_Icon)
        .setFooter(`${Guild.name.endsWith("'s") || Guild.name.endsWith("'S") ? Guild.name : `${Guild.name}'s`} info`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Will list the info of the server."),
    category: "utility",

    async execute(Interaction, Client) {
        const Users_Online = Interaction.guild.members.cache.filter((Member) => Member.presence?.status === "online" || Member.presence?.status === "dnd" || Member.presence?.status === "idle").size.toString();
        const Text_Channel_Count = Interaction.guild.channels.cache.filter((Channel) => Channel.deleted == false && Channel.type === "GUILD_TEXT").size.toString();
        const Voice_Channel_Count = Interaction.guild.channels.cache.filter((Channel) => Channel.deleted == false && Channel.type === "GUILD_VOICE").size.toString();
        const Role_Count = Interaction.guild.roles.cache.filter((Role) => Role.deleted == false).size.toString();
        const Bot_Count = Interaction.guild.members.cache.filter((Member) => Member.user.bot === true).size.toString();

        Interaction.reply({ embeds: [Embed(Interaction.guild, Text_Channel_Count, Voice_Channel_Count, Role_Count, Users_Online, Interaction.guild.iconURL(), Bot_Count)] });
    },
};
