const Discord = require("discord.js");
const fetch = require("node-fetch");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Embed(Title, Author, Lyrics, Image) {
    const Embed = new Discord.MessageEmbed().setTitle(Title).setDescription(Lyrics).setThumbnail(Image).setColor(Global_Embed_Color).setFooter(`❤ Lyrics provided by https://some-random-api.ml • Song by ${Author}`);

    return Embed;
}

function Embed_2(Lyrics, Author) {
    const Embed = new Discord.MessageEmbed().setDescription(Lyrics).setColor(Global_Embed_Color).setFooter(`❤ Lyrics provided by https://some-random-api.ml • Song by ${Author}`);

    return Embed;
}

function Substring(Length, Value) {
    return Value.replace(/\n/g, "--")
        .match(new RegExp(`.{1,${Length}}`, "g"))
        .map((Line) => Line.replace(/--/g, "\n"));
}

module.exports = {
    name: "lyrics",
    aliases: [],
    category: "fun",
    setup: "lyrics",
    show_aliases: true,
    description: "Want to see the lyrics for a song?",

    async execute(Message, Message_Args) {
        const Song = Message_Args.slice(0).join(" ") || null;

        if (!Song) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a song.`)] });

        try {
            const Response = await fetch(`https://some-random-api.ml/lyrics?title=${Song}`);
            const JSON_Response = await Response.json();

            const Embeds = Substring(500, JSON_Response.lyrics).map((Value, Index) => {
                return Index === 0 ? Embed(JSON_Response.title, JSON_Response.author, Value, JSON_Response.thumbnail.genius) : Embed_2(Value, JSON_Response.author);
            });
            Message.channel.send({
                embeds: Embeds,
            });
        } catch (Error) {
            console.log(`Failed to get lyrics.\nError: ${Error}`);

            Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, ${Song === null ? "I failed to get the lyrics. Please try again later." : `I could not find a song named ${Song}.`}`)] });
        }
    },
};
