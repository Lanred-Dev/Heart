const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Embed(Contrast) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription(Contrast <= 2 ? "bright?" : Contrast <= 5 ? "bright enough?" : Contrast <= 10 ? "bright, yet?" : Contrast <= 15 ? "still not what you need?" : Contrast <= 25 ? "its just white now" : Contrast <= 50 || Contrast > 50  ? "STILL, DUDE CALM DOWN" : "bright?")
        .setImage("attachment://pfp.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "brightenpfp",
    aliases: ["brightenpfpcolor", "invertavatar"],
    category: "meme",
    setup: "brightenpfp [User] [Contrast]",
    show_aliases: true,
    description: "bright!!!",

    async execute(Message, Message_Args, Client) {
        var Contrast = Message_Args.slice(1).join(" ");
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;
        if (!Contrast) {
            Contrast = 2;
        } else if (!parseInt(Contrast)) {
            return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid number.`)]});
        };

        const Canvas = CanvasAPI.createCanvas(128, 128);
        const Context = Canvas.getContext("2d");

        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.drawImage(Avatar, 0, 0, 128, 128);

        const Image_Data = Context.getImageData(0, 0, Canvas.width, Canvas.height);
        var Pixels = Image_Data.data;

        for (var Current = 0, Number = Pixels.length; Current < Number; Current += 4) {
            Pixels[Current] = Pixels[Current] * Contrast;
            Pixels[Current + 1] = Pixels[Current + 1] * Contrast;
            Pixels[Current + 2] = Pixels[Current + 2] * Contrast;
        }

        Context.putImageData(Image_Data, 0, 0);

        Message.channel.send({embeds: [Embed(Contrast)], files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "pfp.png")]});
    }
};