const Discord = require("discord.js");
const Canvas = require("canvas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;

function Embed() {
    const Embed = new Discord.MessageEmbed().setDescription("you dolphin man?").setImage("attachment://dolphin_man.png").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("dolphinman")
        .setDescription("dolphin man?")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "meme",

    async execute(Interaction, Client) {
        try {
            const Member = Get_Member(Interaction, true);

            if (!Member) return;

            const Image_Canvas = Canvas.createCanvas(301, 375);
            const Context = Image_Canvas.getContext("2d");
            const Background = await Canvas.loadImage("Core/Assets/Dolphin_Man.png");

            Context.drawImage(Background, 0, 0, 301, 375);

            const Avatar = await Canvas.loadImage(
                Member.user.displayAvatarURL({
                    format: "jpg",
                })
            );

            Context.translate(87 + 83 / 2, 37 + 83 / 2);
            Context.rotate(-15 * (Math.PI / 180));
            Context.translate(-87 - 83 / 2, -37 - 83 / 2);
            Context.drawImage(Avatar, 57, 55, 130, 130);

            Interaction.reply({ embeds: [Embed()], files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "dolphin_man.png")] });
        } catch (Error) {
            Interaction.reply({ embeds: [Error_Embed(Error)] });
        }
    },
};
