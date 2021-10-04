const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Job_Embed(Name, Emoji, Status, Pay, Rank, Hire_Difficulty) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(`${Emoji} ${Name}`)
        .setDescription(`${Status}\n\nJob Rank: **${Rank}**\nPay: **${Pay}**:coin:\nHire Difficulty: **${Hire_Difficulty}**`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "inspectjob",
    aliases: ["jobinfo", "jobinspect"],
    category: "currency",
    setup: "inspectjob [Job Name]",
    show_aliases: true,
    description: "Will list the info of the requested job.",

    async execute(Message, Message_Args, Client) {
        const Requested_Job = Message_Args.slice(0).join(" ").toLowerCase();

        if (!Requested_Job) return Message.channel.send({embeds: [Ambulance_Embed("Please provide a job.")]});

        var Found = false;

        Jobs.forEach(Job => {
            if (Job.Name.toLowerCase() === Requested_Job.toLowerCase()) {
                Message.channel.send({embeds: [Job_Embed(Job.Name, Job.Emoji, Job.Status, Job.Pay, Job.Rank, Job.Hire_Difficulty)]});
                Found = true;

                return;
            }
        });

        if (Found) return;

        Message.channel.send({embeds: [Ambulance_Embed(`I was unable to find a job called **${Requested_Job}**.`)]});
    }
};