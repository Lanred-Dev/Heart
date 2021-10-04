const Get_Tip = Global_Functions.Get_Tip;

module.exports = {
    name: "kayne",
    aliases: ["kaynewest", "staremanlookatcamera"],
    category: "meme",
    setup: "kayne",
    show_aliases: true,
    description: "**kayne west**",

    async execute(Message, Message_Args, Client) {
        Message.channel.send(Get_Tip());
        Message.channel.send("https://tenor.com/view/kanye-west-stare-staring-funny-gif-13590085");
    }
};