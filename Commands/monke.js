const Discord = require("discord.js");
const Canvas = require("canvas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;

function Embed() {
    const Embed = new Discord.MessageEmbed().setDescription("you monke?").setImage("attachment://monke.png").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("monke")
        .setDescription("we like monke")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "meme",

    async execute(Interation, Client) {
        const Member = Get_Member(Interation, true, false);

        if (!Member) return;

        const Image_Canvas = Canvas.createCanvas(224, 224);
        const Context = Image_Canvas.getContext("2d");
        const Background = await Canvas.loadImage("Core/Assets/Monke.png");

        Context.drawImage(Background, 0, 0, 244, 224);

        const Avatar = await Canvas.loadImage(
            Member.user.displayAvatarURL({
                format: "jpg",
            })
        );

        Context.translate(87 + 83 / 2, 37 + 83 / 2);
        Context.rotate(25 * (Math.PI / 180));
        Context.translate(-87 - 83 / 2, -37 - 83 / 2);
        Context.drawImage(Avatar, 87, 37, 83, 83);

        Interation.reply({
            embeds: [Embed()],
            files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "monke.png")],
        });
    },
};
