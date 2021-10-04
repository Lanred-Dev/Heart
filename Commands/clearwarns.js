const DiscordAPI = require("discord.js");
const Get_Member = Global_Functions.Get_Member;

function Clear_Embed(Admin, Server) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:")
        .setDescription(`All of your warns have been removed from ${Server}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Moderator",
            value: Admin,
            inline: true
        });

    return Embed;
}

function Log_Embed(User, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${User}'s warns have been removed by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "clearwarns",
    aliases: ["removewarns"],
    category: "moderation",
    setup: "clearwarns [User]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "This command will warn a user!",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (!Moderation_Database.Warns[Message.guild.id][Member.id]) Moderation_Database.Warns[Message.guild.id][Member.id] = {
            warns: {},
            amount: 0
        };

        Member.send({
            embeds: [Clear_Embed(Message.author.toString(), Message.guild.name)]
        }).catch();

        Message.channel.send({
            embeds: [
                new DiscordAPI.MessageEmbed()
                .setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:")
                .setDescription(`${Member.toString()}'s warns have been removed.`)
                .setColor(Global_Embed_Color)
            ]
        });
        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embeds: [Log_Embed(Member.tag, Message.author.toString())]
        });

        Moderation_Database[Message.guild.id].warns[Member.id].amount = Moderation_Database[Message.guild.id].warns[Member.id].amount = 0;
        Moderation_Database[Message.guild.id].warns[Member.id].warns = {};
    }
};