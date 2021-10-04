const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Warn_Embed(Reason, Admin, Server) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🚨 [Police Siren] 🚨")
        .setDescription(`You have been warned in **${Server}**.`)
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
        .setDescription(`${User} has been warned by ${Moderator}.`)
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
    name: "warn",
    aliases: [],
    category: "moderation",
    setup: "warn [User] [Reason]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "This command will warn a user!",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (Member === Message.member) return Message.channel.send({embeds: [Ambulance_Embed("You cant warn yourself.")]});
        if (Member.permissions.has(DiscordAPI.Permissions.FLAGS["ADMINISTRATOR"])) return Message.channel.send({embeds: [Ambulance_Embed("I cant warn fellow admins.")]});
        if (!Moderation_Database[Message.guild.id].warns[Member.id]) Moderation_Database[Message.guild.id].warns[Member.id] = {
            warns: {},
            amount: 0
        };

        const Reason = Message_Args.slice(1).join(" ") || "No reason";
        
        Member.send({embeds: [Warn_Embed(Reason, Message.author.toString(), Message.guild.name)]}).catch();

        Message.channel.send({
            embeds: [new DiscordAPI.MessageEmbed()
            .setTitle("🚨 [Police Siren] 🚨")
            .setDescription(`${Member.toString()} has been warned.`)
            .setColor(Global_Embed_Color)
        ]});

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embeds: [Log_Embed(Reason, Member.tag, Message.author.toString())]
        });

        Moderation_Database[Message.guild.id].warns[Member.id].amount += 1;
        Moderation_Database[Message.guild.id].warns[Member.id].warns[Moderation_Database[Message.guild.id].warns[Member.id].amount] = {
            moderator: Message.author.toString(),
            reason: Reason
        };
    }
};