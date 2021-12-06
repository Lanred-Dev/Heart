const Discord = require("discord.js");
const Canvas = require("canvas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;

function Embed() {
    const Embed = new Discord.MessageEmbed().setDescription("he is **buff**").setImage("attachment://mamdouh.png").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("mamdouh")
        .setDescription("Mamdouh, what else do I have to say?")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "meme",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false);

        if (!Member) return;

        const Image_Canvas = Canvas.createCanvas(512, 478);
        const Context = Image_Canvas.getContext("2d");
        const Background = await Canvas.loadImage("Core/Assets/mamdouh.png");

        Context.drawImage(Background, 0, 0, 512, 478);

        const Avatar = await Canvas.loadImage(
            Member.user.displayAvatarURL({
                format: "jpg",
            })
        );

        Context.drawImage(Avatar, 209, 60, 80, 80);

        Interaction.reply({ embeds: [Embed()], files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "mamdouh.png")] });
    },
};
