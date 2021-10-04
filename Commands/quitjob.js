const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Quit_Embed(Job, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":office_worker: [Job noises] :office_worker:")
        .setDescription(`${User}, you quit your job as a **${Job}**.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "quitjob",
    aliases: [],
    category: "currency",
    setup: "quitjob",
    show_aliases: true,
    description: "Lets you resign from your current job.",

    async execute(Message, Message_Args, Client) {
        if (Users_Database.Currency[Message.author.id].job === null) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have a job.`)]});

        Message.channel.send({embeds: [Quit_Embed(Users_Database.Currency[Message.author.id].job, Message.author.toString())]});

        Users_Database.Currency[Message.author.id].job = null;
    }
};