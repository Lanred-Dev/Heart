const Discord = require("discord.js");
const Webhook_Client = new Discord.WebhookClient({ id: process.env.SUGGESTION_LINK_ID, token: process.env.SUGGESTION_LINK_TOKEN });
const Messages = ["Thanks for the suggestion/feedback!", "Much love ❤, we will take that into consideration.", "Thank you, youre a legend!"];
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Thank_You_Embed() {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":sunglasses: Your cool my bruv! :sunglasses:")
        .setDescription(Messages[Math.floor(Math.random() * Messages.length)])
        .setColor(Global_Embed_Color);

    return Embed;
}

function Feedback_Embed(Feedback, User) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("wow! feedback for us devs")
        .setDescription(Feedback)
        .addFields({
            name: "User",
            value: User,
            inline: true,
        })
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "botfeedback",
    aliases: [],
    category: "utility",
    setup: "botfeedback [Message]",
    show_aliases: true,
    cooldown: 1.8e6,
    description: "Send us some feedback!",

    async execute(Message, Message_Args, Client) {
        const Feedback = Message_Args.slice(0).join(" ");

        if (!Feedback) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a message.")] });

        await Webhook_Client.send("Feedback", {
            username: "Feedback",
            content: "",
            embeds: [Feedback_Embed(Feedback, Message.member.user.tag.toString())],
        });

        Message.author.send(Thank_You_Embed()).catch();
    },
};
