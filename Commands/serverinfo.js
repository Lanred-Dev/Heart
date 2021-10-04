const DiscordAPI = require("discord.js");
const Get_Server_Roles = Global_Functions.Get_Server_Roles;

function Format_Date(Date) {
    var Hours = Date.getHours();
    var Minutes = Date.getMinutes();
    const Time_Prefix = Hours >= 12 ? "pm" : "am";
    Hours = Hours % 12;
    Hours = Hours != null ? Hours : 12;
    Minutes = Minutes < 10 ? `0${Minutes}` : Minutes;

    return `${Hours}:${Minutes} ${Time_Prefix}`;
};

function Format_Server_Age(Number_Of_Days) {
    var Years = Math.floor(Number_Of_Days / 365);
    var Months = Math.floor(Number_Of_Days % 365 / 30);
    var Days = Math.floor(Number_Of_Days % 365 % 30);

    return `${Years > 0 ? Years + (Years == 1 ? " year, " : " years, ") : ""}${Months > 0 ? Months + (Months == 1 ? " month, " : " months, ") : ""}${Days > 0 ? Days + (Days == 1 ? " day" : " days") : ""}`;
}

function Info_Embed(Guild, Text_Channel_Count, Voice_Channel_Count, Role_Count, Users_Online, Server_Icon) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Guild.name)
        .setColor(Guild.roles.highest.color)
        .addFields({
            name: "Guild Created",
            value: `${Guild.createdAt.toLocaleDateString()} at ${Format_Date(Guild.createdAt)}`,
            inline: true
        }, {
            name: "Guild Age",
            value: `${Format_Server_Age(Math.round(Math.abs((Guild.createdAt - new Date()) / (24 * 60 * 60 * 1000))))}`,
            inline: true
        }, {
            name: "User Count",
            value: Guild.memberCount.toString(),
            inline: true
        }, {
            name: "Users Online",
            value: `${Users_Online}/${Guild.memberCount.toString()}`,
            inline: true
        }, {
            name: "Text Channel Count",
            value: Text_Channel_Count,
            inline: true
        }, {
            name: "Voice Channel Count",
            value: Voice_Channel_Count,
            inline: true
        }, {
            name: "Role Count",
            value: Role_Count,
            inline: true
        }, {
            name: "Highest Role",
            value: Guild.roles.highest.toString(),
            inline: true
        }, {
            name: "Roles",
            value: Get_Server_Roles(Guild, 5),
            inline: true
        })
        .setThumbnail(Server_Icon)
        .setFooter(`❤ ${Guild.name.endsWith("'s") || Guild.name.endsWith("'S") ? Guild.name : `${Guild.name}'s`} roles`);

    return Embed;
}

module.exports = {
    name: "serverinfo",
    aliases: ["sinfo"],
    category: "utility",
    setup: "serverinfo",
    show_aliases: true,
    description: "Will list the info of the server the command is used in.",

    async execute(Message, Message_Args, Client) {
        const Users_Online = Message.guild.members.cache.filter(Member => Member.presence?.status === "online" || Member.presence?.status === "dnd" || Member.presence?.status === "idle").size.toString();
        const Text_Channel_Count = Message.guild.channels.cache.filter(Channel => Channel.deleted == false && Channel.type === "GUILD_TEXT").size.toString();
        const Voice_Channel_Count = Message.guild.channels.cache.filter(Channel => Channel.deleted == false && Channel.type === "GUILD_VOICE").size.toString();
        const Role_Count = Message.guild.roles.cache.filter(Role => Role.deleted == false).size.toString();

        Message.channel.send({embeds: [Info_Embed(Message.guild, Text_Channel_Count, Voice_Channel_Count, Role_Count, Users_Online, Message.guild.iconURL())]});
    }
};