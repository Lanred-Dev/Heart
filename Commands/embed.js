const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Create_Embed(Title, Description, Color, Footer, Icon, Thumbnail, URL) {
    const Embed = new Discord.MessageEmbed().setDescription(Description).setColor(Color).setFooter(Footer).setURL(URL).setThumbnail(Thumbnail).setAuthor(Title, Icon, "");

    return Embed;
}

function Get_Title(String) {
    const Match = String.match(/{title:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{title:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Description(String) {
    const Match = String.match(/{description:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{description:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Footer(String) {
    const Match = String.match(/{footer:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{footer:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Color(String) {
    const Match = String.match(/{color:.*}/gim);

    if (!Match) return "#000000";

    const Replace_1 = Match[0].replace(/{color:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Icon(String) {
    const Match = String.match(/{icon:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{icon:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Thumbnail(String) {
    const Match = String.match(/{thumbnail:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{thumbnail:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_URL(String) {
    const Match = String.match(/{url:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{url:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

module.exports = {
    name: "embed",
    aliases: [],
    category: "utility",
    setup: "embed {title: Title} {description: Description} {footer: Footer} {color: Hex Color} {url: URL} {icon: ImageURL} {thumbnail: ImageURL}",
    show_aliases: true,
    description: "Want to send an embed? Use this command!",

    async execute(Message, Message_Args, Client, Command) {
        const Description = Get_Description(Message.content);
        const Title = Get_Title(Message.content);

        if (!Description) {
            if (!Title) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide content for the embed.`)] });
        } else if (!Title) {
            if (!Description) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide content for the embed.`)] });
        }

        const Color = Get_Color(Message.content);
        const Footer = Get_Footer(Message.content);
        const Icon = Get_Icon(Message.content);
        const Thumbnail = Get_Thumbnail(Message.content);
        const URL = Get_URL(Message.content);

        Message.channel.send({ embeds: [Create_Embed(Title, Description, Color, Footer, Icon, Thumbnail, URL)] });
    },
};
