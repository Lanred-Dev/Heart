const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;

function Monke_Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription("you monke?")
        .setImage("attachment://monke.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "monke",
    aliases: ["monkey", "minke"],
    category: "meme",
    setup: "monke [User]",
    show_aliases: true,
    description: "We like *monke*.",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        const Canvas = CanvasAPI.createCanvas(224, 224);
        const Context = Canvas.getContext("2d");
        const Background = await CanvasAPI.loadImage("Core/Assets/Monke.png");

        Context.drawImage(Background, 0, 0, 244, 224);

        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.translate(87 + 83 / 2, 37 + 83 / 2);
        Context.rotate(25 * (Math.PI / 180));
        Context.translate(-87 - 83 / 2, -37 - 83 / 2);
        Context.drawImage(Avatar, 87, 37, 83, 83);
        Message.channel.send({
            embeds: [Monke_Embed()],
            files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "monke.png")]
        });
    }
};