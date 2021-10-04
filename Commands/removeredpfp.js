const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription("no more red then")
        .setImage("attachment://pfp.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "removeredpfp",
    aliases: ["rredpfp", "removeredfrompfp"],
    category: "meme",
    setup: "removeredpfp [User]",
    show_aliases: true,
    description: "I see that you dont like the color red.",

    async execute(Message, Message_Args, Client) {
        var Contrast = Message_Args.slice(1).join(" ");
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;
        if (!Contrast) {
            Contrast = 2;
        } else if (!parseInt(Contrast)) {
            return Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid number.`)]
            });
        };

        const Canvas = CanvasAPI.createCanvas(128, 128);
        const Context = Canvas.getContext("2d");

        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.drawImage(Avatar, 0, 0, 128, 128);

        var Intensity = Math.floor(Math.random() * 85);

        if (Intensity < 55) {
            Intensity = 55;
        }

        var Radius = Math.floor(Math.random() * 15);

        if (Radius < 8) {
            Radius = 8;
        }

        const Image_Data = Context.getImageData(0, 0, Canvas.width, Canvas.height);
        var Pixels = Image_Data.data;

        for (var Current = 0, Number = Pixels.length; Current < Number; Current += 4) {
            Pixels[Current] = 0;
        }

        Context.putImageData(Image_Data, 0, 0);

        Message.channel.send({
            embeds: [Embed()],
            files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "pfp.png")]
        });
    }
};