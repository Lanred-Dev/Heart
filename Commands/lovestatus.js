const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Statues = {
    1: ["you hate each other", "do I know you?", "go away", "imma go ahead and swipe left", "never seen you before"],
    2: ["you hate each other", "nah", "go away", "you want each other to die"],
    3: ["are we friends?", "maybe", "i kinda know you"],
    4: ["we are friends", "we are hanging out more", "i dont want you but wont turn you down"],
    5: ["dating?", "we are hanging out daily", "wont reject you"],
    6: ["confirmed dating", "you seem fine to me", "been dating for a while now"],
    7: ["we are getting married", "you are sleeping with me now", "you lookin real nice, lets get married"],
}
const Get_Member = Global_Functions.Get_Member;
const Round_Image = Global_Functions.Round_Image;

function Embed(Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription(Status)
        .setImage("attachment://love_status.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

const Set_Text = (Canvas, Text) => {
    const Context = Canvas.getContext("2d");
    var Size = 70;

    do {
        Context.font = `${Size -= 10}px bsans-bold`;
    } while (Context.measureText(Text).width > Canvas.width - 300);

    return Context.font;
}

module.exports = {
    name: "lovestatus",
    aliases: [],
    category: "love",
    setup: "lovestatus [User]",
    show_aliases: true,
    description: "Wanna know your love status with another user?",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        var Love = Math.floor(Math.random() * 100);
        var Status = "";

        if (Message.member === Member) {
            Love = 0;
        } else if (Member.user.bot) {
            Love = 200
        };

        if (Love >= 100) {
            Status = Statues[7][Math.floor(Math.random() * Statues[7].length)];
        } else if (Love > 90) {
            Status = Statues[6][Math.floor(Math.random() * Statues[6].length)];
        } else if (Love > 65) {
            Status = Statues[5][Math.floor(Math.random() * Statues[5].length)];
        } else if (Love > 40) {
            Status = Statues[4][Math.floor(Math.random() * Statues[4].length)];
        } else if (Love > 15) {
            Status = Statues[3][Math.floor(Math.random() * Statues[3].length)];
        } else if (Love > 1) {
            Status = Statues[2][Math.floor(Math.random() * Statues[2].length)];
        } else if (Love >= 0) {
            Status = Statues[1][Math.floor(Math.random() * Statues[1].length)];
        };

        const Canvas = CanvasAPI.createCanvas(800, 600);
        const Context = Canvas.getContext("2d");
        const Background = await CanvasAPI.loadImage("Core/Assets/Love_Status.png");

        Context.drawImage(Background, 0, 0, 800, 600);

        Context.font = Set_Text(Canvas, Love + "%");
        Context.fillStyle = "#ffffff";
        Context.shadowBlur = 30;
        Context.shadowColor = "white";

        if (Love >= 100) {
            Context.fillText(`${Love}%`, 317, 320);
        } else if (Love < 10) {
            Context.fillText(`${Love}%`, 350, 320);
        } else {
            Context.fillText(`${Love}%`, 340, 320);
        }

        const Avatar_1 = await CanvasAPI.loadImage(Message.author.displayAvatarURL({
            format: "jpg"
        }));

        Context.save();
        Round_Image(Context, 85, 200, 200, 200, 10);
        Context.clip();
        Context.drawImage(Avatar_1, 85, 200, 200, 200);
        Context.restore();

        const Avatar_2 = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.save();
        Round_Image(Context, 515, 200, 200, 200, 10);
        Context.clip();
        Context.drawImage(Avatar_2, 515, 200, 200, 200);
        Context.restore();

        Message.channel.send({embeds: [Embed(Status)], files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "love_status.png")]});
    }
};