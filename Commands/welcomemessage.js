const DiscordAPI = require("discord.js");
const fsAPI = require("fs");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log(Message, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the welcome message.")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Message",
            value: Message,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
};

function Get_Embed(String) {
    const Match = String.match(/{embed:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{embed:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Title(String) {
    const Match = String.match(/{title:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{title:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Description(String) {
    const Match = String.match(/{title:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{title:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Footer(String) {
    const Match = String.match(/{footer:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{footer:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Color(String) {
    const Match = String.match(/{color:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{color:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Icon(String) {
    const Match = String.match(/{icon:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{icon:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Thumbnail(String) {
    const Match = String.match(/{thumbnail:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{thumbnail:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Channel(String) {
    const Match = String.match(/{channel:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{channel:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

module.exports = {
    name: "welcomemessage",
    aliases: ["wmessage"],
    category: "utility",
    setup: "welcomemessage {channel: Channel Name} {embed: True/False} {description: Description} {footer: Footer} {color: Hex Color} {icon: ImageURL} {thumbnail: ImageURL}",
    show_aliases: true,
    description: "A command to welcome new users to the server!",
    permissions: ["ADMINISTRATOR"],

    async execute(Message, Message_Args, Client, Command) {
        const Channel = Get_Channel(Message.content);

        if (!Channel) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a channel for the welcome message.`)]
        });

        const Description = Get_Description(Message.content);
        const Title = Get_Title(Message.content);

        if (!Description) {
            if (!Title) return Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide content for the welcome message.`)]
            });
        } else if (!Title) {
            if (!Description) return Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide content for the welcome message.`)]
            });
        }

        const Embed = Get_Embed(Message.content) || false;
        const Color = Get_Color(Message.content);
        const Footer = Get_Footer(Message.content);
        const Icon = Get_Icon(Message.content);
        const Thumbnail = Get_Thumbnail(Message.content);
        const URL = Get_URL(Message.content);

        Message.channel.send({
            embeds: [new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The welcome message has been updated.")
                .setColor(Global_Embed_Color)
                .setFooter("Use .welcomemessagepreview to preview the message.")
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) {
            Log_Channel.send({
                embeds: [Log(New_Message, Message.author.toString())]
            });
        }

        Welcome_Database[Message.guild.id].welcome.message = New_Message;
        fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
    }
};