const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Messages = [
    "hi",
    "much love ❤",
    "❤ you!",
    "life?",
    "jack and jill sit on the hill to then fall.",
    "Tomorrow will bring something new", "so leave today as a memory.",
    "The beauty of the sunset was obscured by the industrial cranes.",
    "Warm beer on a cold day isnt my idea of fun.",
    "They improved dramatically once the lead singer left.",
    "His mind was blown that there was nothing in space except space itself.",
    "It took him a month to finish the meal.",
    "He had a wall full of masks so she could wear a different face every day.",
    "For the 216th time", "he said he would quit drinking soda after this last Coke.",
    "He quietly entered the museum as the super bowl started.",
    "Car safety systems have come a long way", "but he was out to prove they could be outsmarted.",
    "He excelled at firing people nicely.",
    "Sometimes it is better to just walk away from things and go back to them later when you’re in a better frame of mind.",
    "It was a really good Monday for being a Saturday.",
    "You realize youre not alone as you sit in your bedroom massaging your calves after a long day of playing tug-of-war with Grandpa Joe in the hospital.",
    "The sudden rainstorm washed crocodiles into the ocean.",
    "Abstraction is often one floor above you.",
    "I thought red would have felt warmer in summer but I didnt think about the equator.",
    "She always had an interesting perspective on why the world must be flat.",
    "Happiness can be found in the depths of chocolate pudding.",
    "The book is in front of the table.",
    "She finally understood that grief was her love with no place for it to go.",
    "The irony of the situation wasnt lost on anyone in the room.",
    "She had a difficult time owning up to her own crazy self.",
    "The doll spun around in circles in hopes of coming alive.",
    "The opportunity of a lifetime passed before him as he tried to decide between a cone or a cup.",
    "The shooter says goodbye to his love.",
    "Youll see the rainbow bridge after it rains cats and dogs.",
    "Watching the geriatric men’s softball team brought back memories of 3 yr olds playing t-ball.",
    "We should play with legos at camp.",
    "She thought thered be sufficient time if she hid her watch."
];
const Wrap_Text = Global_Functions.Wrap_Text;
const Round_Image = Global_Functions.Round_Image;

function Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription("why is this command called **f**?")
        .setImage("attachment://f.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "f",
    aliases: ["randomsaying", "saying"],
    category: "fun",
    setup: "f",
    show_aliases: true,
    description: "Just a random saying I guess.",

    async execute(Message, Message_Args, Client) {
        const Canvas = CanvasAPI.createCanvas(800, 150);
        const Context = Canvas.getContext("2d");
        const Background = await CanvasAPI.loadImage("Core/Assets/f.png");
        const Status = Messages[Math.floor(Math.random() * Messages.length)];

        Context.drawImage(Background, 0, 0, 800, 150);

        Context.font = "35px bsans-bold";
        Context.fillStyle = "#ffffff";
        Context.shadowBlur = 30;
        Context.shadowColor = "white";

        Wrap_Text(Context, Status, 150, (Canvas.height - 17.5 / 2) / 2, 650, 35);

        const Avatar = await CanvasAPI.loadImage(Message.author.displayAvatarURL({
            format: "jpg"
        }));
        
        Context.save();
        Round_Image(Context, 25, 25, 100, 100, 10);
        Context.clip();
        Context.drawImage(Avatar, 25, 25, 100, 100);
        Context.restore();
        
        Message.channel.send({
            embeds: [Embed()],
            files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "f.png")]
        });
    }
};