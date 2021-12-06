const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");

function Embed(Hex, RGB) {
    const Embed = new Discord.MessageEmbed()
        .setDescription(`I guess you just like [colors](http://localhost:3000/features/color?color=${Hex.substring(1)})`)
        .addFields(
            {
                name: "Hex",
                value: Hex,
                inline: true,
            },
            {
                name: "RGB",
                value: RGB,
                inline: true,
            }
        )
        .setThumbnail("attachment://Preview.png")
        .setColor(Hex);

    return Embed;
}

function To_RGB(Hex) {
    const Result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);

    return Result
        ? {
              R: parseInt(Result[1], 16),
              G: parseInt(Result[2], 16),
              B: parseInt(Result[3], 16),
          }
        : {
              R: 0,
              G: 0,
              B: 0,
          };
}

module.exports = {
    info: new SlashCommandBuilder().setName("randomcolor").setDescription("Chooses a random color!"),
    category: "fun",

    async execute(Interaction, Client) {
        let Color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        Color.length === 5 ? (Color = `${Color}0`) : (Color = Color);
        let Color_RGB = To_RGB(Color);
        Color_RGB = `${Color_RGB.R}, ${Color_RGB.G}, ${Color_RGB.B}`;

        const Image_Canvas = Canvas.createCanvas(128, 128);
        const Context = Image_Canvas.getContext("2d");

        Context.fillStyle = Color;
        Context.fillRect(0, 0, Image_Canvas.width, Image_Canvas.height);

        Interaction.reply({ embeds: [Embed(Color, Color_RGB)], files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "Preview.png")] });
    },
};
