const DiscordAPI = require("discord.js");
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Appeal, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":notepad_spiral: [Taking Notes] :notepad_spiral:")
        .setDescription(`${Moderator} has ${Toggle === true ? "set" : "updated"} the appeal statement.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Statement",
            value: Appeal,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "appealstatement",
    aliases: ["banappeal"],
    category: "moderation",
    setup: "appealstatement [Statement]",
    show_aliases: true,
    permissions: ["ADMINISTRATOR", "BAN_MEMBERS"],
    description: "Will set the ban appeal statement.",

    async execute(Message, Message_Args, Client, Command) {
        const Appeal = Message_Args.slice(0).join(" ") || "None";

        Message.channel.send({
            embeds: [new DiscordAPI.MessageEmbed()
                .setTitle(":notepad_spiral: [Taking Notes] :notepad_spiral:")
                .setDescription("The appeal statement has been updated.")
                .setColor(Global_Embed_Color)
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embds: [Log_Embed(Appeal, Message.author.toString(), Moderation_Database[Message.guild.id].appeal_statement === null ? true : false)]
        });

        Moderation_Database[Message.guild.id].appeal_statement = Appeal;
    }
};