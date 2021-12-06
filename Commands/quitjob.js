const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Embed(Job, User) {
    const Embed = new Discord.MessageEmbed().setTitle(":office_worker: [Job noises] :office_worker:").setDescription(`${User}, you quit your job as a **${Job}**.`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "quitjob",
    aliases: ["quitoccupation"],
    category: "currency",
    setup: "quitjob",
    show_aliases: true,
    description: "Lets you resign from your current job, dont know why you would want to do so.",

    async execute(Message, Message_Args, Client) {
        if (Global_Databases.Users[Message.author.id].job === null) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have a job.`)] });

        Message.channel.send({ embeds: [Embed(Global_Databases.Users[Message.author.id].job, Message.author.toString())] });

        Global_Databases.Users[Message.author.id].job = null;
    },
};
