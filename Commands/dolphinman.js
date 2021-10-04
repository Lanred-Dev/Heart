const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;

function Dolphin_Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription("you dolphin man?")
        .setImage("attachment://dolphin_man.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "dolphinman",
    aliases: [],
    category: "meme",
    setup: "dolphinman [User]",
    show_aliases: true,
    description: "dolphin man?",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        const Canvas = CanvasAPI.createCanvas(301, 375);
        const Context = Canvas.getContext("2d");
        const Background = await CanvasAPI.loadImage("Core/Assets/Dolphin_Man.png");

        Context.drawImage(Background, 0, 0, 301, 375);

        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.translate(87 + 83 / 2, 37 + 83 / 2);
        Context.rotate(-15 * (Math.PI / 180));
        Context.translate(-87 - 83 / 2, -37 - 83 / 2);
        Context.drawImage(Avatar, 57, 55, 130, 130);
        Message.channel.send({embeds: [Dolphin_Embed()], files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "dolphin_man.png")]});
    }
};