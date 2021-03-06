const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;

function Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription("you inverted!")
        .setImage("attachment://pfp.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "invertpfp",
    aliases: ["invertpfpcolor", "invertavatar"],
    category: "meme",
    setup: "invertpfp [User]",
    show_aliases: true,
    description: "wow, so inverted...",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        const Canvas = CanvasAPI.createCanvas(128, 128);
        const Context = Canvas.getContext("2d");

        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.drawImage(Avatar, 0, 0, 128, 128);

        const Image_Data = Context.getImageData(0, 0, Canvas.width, Canvas.height);
        var Pixels = Image_Data.data;

        for (var Current = 0, Number = Pixels.length; Current < Number; Current += 4) {
            Pixels[Current] = 255 - Pixels[Current];
            Pixels[Current + 1] = 255 - Pixels[Current + 1];
            Pixels[Current + 2] = 255 - Pixels[Current + 2];
        }

        Context.putImageData(Image_Data, 0, 0);

        Message.channel.send({embeds: [Embed()], files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "pfp.png")]});
    }
};