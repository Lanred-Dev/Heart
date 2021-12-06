const Discord = require("discord.js");
const Canvas = require("canvas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;
const Error_Embed = Global_Functions.Error_Embed;

function Embed() {
    const Embed = new Discord.MessageEmbed().setDescription("no more red then").setImage("attachment://pfp.png").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("removeredpfp")
        .setDescription("I see that you dont like the color red.")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(true)),
    category: "fun",

    async execute(Interaction, Client) {
        try {
            const Member = Get_Member(Interaction, true);

            if (!Member) return;

            const Image_Canvas = Canvas.createCanvas(128, 128);
            const Context = Image_Canvas.getContext("2d");

            const Avatar = await Canvas.loadImage(
                Member.user.displayAvatarURL({
                    format: "jpg",
                })
            );

            Context.drawImage(Avatar, 0, 0, 128, 128);

            const Image_Data = Context.getImageData(0, 0, Image_Canvas.width, Image_Canvas.height);
            let Pixels = Image_Data.data;

            for (let Current = 0, Number = Pixels.length; Current < Number; Current += 4) {
                Pixels[Current] = 0;
            }

            Context.putImageData(Image_Data, 0, 0);

            Interaction.reply({ embeds: [Embed()], files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "pfp.png")] });
        } catch (Error) {
            Interaction.reply({ embeds: [Error_Embed(Error)] });
        }
    },
};
