const Discord = require("discord.js");
const Canvas = require("canvas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Statues = {
    1: ["you hate each other", "do I know you?", "go away", "imma go ahead and swipe left", "never seen you before"],
    2: ["you hate each other", "nah", "go away", "you want each other to die"],
    3: ["are we friends?", "maybe", "i kinda know you"],
    4: ["we are friends", "we are hanging out more", "i dont want you but wont turn you down"],
    5: ["dating?", "we are hanging out daily", "wont reject you"],
    6: ["confirmed dating", "you seem fine to me", "been dating for a while now"],
    7: ["we are getting married", "you are sleeping with me now", "you lookin real nice, lets get married"],
};
const Get_Member = Global_Functions.Get_Member;
const Round_Image = Global_Functions.Round_Image;

function Embed(Status) {
    const Embed = new Discord.MessageEmbed().setDescription(Status).setImage("attachment://love_status.png").setColor(Global_Embed_Color);

    return Embed;
}

const Set_Text = (Image_Canvas, Text) => {
    const Context = Image_Canvas.getContext("2d");
    let Size = 70;

    do {
        Context.font = `${(Size -= 10)}px Regular`;
    } while (Context.measureText(Text).width > Image_Canvas.width - 300);

    return Context.font;
};

module.exports = {
    info: new SlashCommandBuilder()
        .setName("lovestatus")
        .setDescription("It is of the most importance to love")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "love",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false);

        if (!Member) return;

        const Love_Amount = Interaction.member === Member ? 0 : Member.user.bot ? 200 : Math.floor(Math.random() * 100);
        let Status = "";

        if (Love_Amount >= 100) {
            Status = Statues[7][Math.floor(Math.random() * Statues[7].length)];
        } else if (Love_Amount > 90) {
            Status = Statues[6][Math.floor(Math.random() * Statues[6].length)];
        } else if (Love_Amount > 65) {
            Status = Statues[5][Math.floor(Math.random() * Statues[5].length)];
        } else if (Love_Amount > 40) {
            Status = Statues[4][Math.floor(Math.random() * Statues[4].length)];
        } else if (Love_Amount > 15) {
            Status = Statues[3][Math.floor(Math.random() * Statues[3].length)];
        } else if (Love_Amount > 1) {
            Status = Statues[2][Math.floor(Math.random() * Statues[2].length)];
        } else if (Love_Amount >= 0) {
            Status = Statues[1][Math.floor(Math.random() * Statues[1].length)];
        }

        const Image_Canvas = Canvas.createCanvas(800, 600);
        const Context = Image_Canvas.getContext("2d");
        const Background = await Canvas.loadImage("Core/Assets/Love_Status.png");

        Context.drawImage(Background, 0, 0, 800, 600);

        Context.font = Set_Text(Image_Canvas, Love_Amount + "%");
        Context.fillStyle = "#ffffff";
        Context.shadowBlur = 30;
        Context.shadowColor = "white";

        if (Love_Amount >= 100) {
            Context.fillText(`${Love_Amount}%`, 317, 320);
        } else if (Love_Amount < 10) {
            Context.fillText(`${Love_Amount}%`, 350, 320);
        } else {
            Context.fillText(`${Love_Amount}%`, 340, 320);
        }

        const Avatar_1 = await Canvas.loadImage(
            Interaction.user.displayAvatarURL({
                format: "jpg",
            })
        );

        Context.save();
        Round_Image(Context, 85, 200, 200, 200, 10);
        Context.clip();
        Context.drawImage(Avatar_1, 85, 200, 200, 200);
        Context.restore();

        const Avatar_2 = await Canvas.loadImage(
            Member.user.displayAvatarURL({
                format: "jpg",
            })
        );

        Context.save();
        Round_Image(Context, 515, 200, 200, 200, 10);
        Context.clip();
        Context.drawImage(Avatar_2, 515, 200, 200, 200);
        Context.restore();

        Interaction.reply({ embeds: [Embed(Status)], files: [new Discord.MessageAttachment(Image_Canvas.toBuffer(), "love_status.png")] });
    },
};
