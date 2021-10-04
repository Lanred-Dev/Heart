const DiscordAPI = require("discord.js");
const Job_Ranks = ["1", "2", "3"];
const Jobs = require("../Core/utils/Data/Jobs.json");

function Jobs_Embed(Status, Rank) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":office_worker: [Job noises] :office_worker:")
        .setDescription(Status)
        .setColor(Global_Embed_Color)
        .setFooter(`❤ Rank ${Rank} jobs`);

    return Embed;
}

module.exports = {
    name: "jobs",
    aliases: ["jobsiwanttogetlikern"],
    category: "currency",
    setup: "jobs [Jobs Rank]",
    show_aliases: true,
    description: "You dont know all the jobs or just want to see them?",

    async execute(Message, Message_Args, Client) {
        var Requested_Rank = Message_Args[0];

        if (!Requested_Rank || isNaN(Requested_Rank) || !parseInt(Requested_Rank) || Job_Ranks[Requested_Rank] === null) Requested_Rank = 1;

        Requested_Rank = parseInt(Requested_Rank);

        var Status = "";
        var Job_Amount = 0;

        Jobs.forEach(Job => {
            if (Job.Rank === Requested_Rank) {
                Job_Amount++;
            };
        });

        Status = `${Message.author.toString()}, there are **${Job_Amount}** rank ${Requested_Rank} jobs.`;

        Jobs.forEach(Job => {
            if (Job.Rank === Requested_Rank) {
                Status = `${Status}\n\n${Job.Emoji} **${Job.Name}**\nAverage Pay: ${Job.Pay}:coin:\nHire Difficulty: ${Job.Hire_Difficulty}`;
            };
        });

        Message.channel.send({embeds: [Jobs_Embed(Status, Requested_Rank)]});
    }
};