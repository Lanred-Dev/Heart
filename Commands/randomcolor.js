const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");

function Embed(Hex, RGB) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription(`I guess you just like [colors](http://localhost:3000/features/color?color=${Hex.substring(1)})`)
        .addFields({
            name: "Hex",
            value: Hex,
            inline: true
        }, {
            name: "RGB",
            value: RGB,
            inline: true
        })
        .setThumbnail("attachment://Preview.png")
        .setColor(Hex);

    return Embed;
}

function To_RGB(Hex) {
    const Result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);

    return Result ? {
        R: parseInt(Result[1], 16),
        G: parseInt(Result[2], 16),
        B: parseInt(Result[3], 16)
    } : {
        R: 0,
        G: 0,
        B: 0
    };
}

module.exports = {
    name: "randomcolor",
    aliases: ["rcolor"],
    category: "fun",
    setup: "randomcolor",
    show_aliases: true,
    description: "Chooses a random color!",

    async execute(Message, Message_Args, Client) {
        var Color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        Color.length === 5 ? Color = `${Color}0` : Color = Color;

        var Color_RGB = To_RGB(Color);
        Color_RGB = `${Color_RGB.R}, ${Color_RGB.G}, ${Color_RGB.B}`;

        const Canvas = CanvasAPI.createCanvas(128, 128);
        const Context = Canvas.getContext("2d");

        Context.fillStyle = Color;
        Context.fillRect(0, 0, Canvas.width, Canvas.height);

        Message.channel.send({
            embeds: [Embed(Color, Color_RGB)],
            files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "Preview.png")]
        });
    }
};