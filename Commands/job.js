const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Jobs = require("../Core/utils/Data/Jobs.json");

function Hired_Embed(Job, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":office_worker: [Job noises] :office_worker:")
        .setDescription(`${User}, you got a job as a **${Job}**! Welcome to the team.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Rejected_Embed(Job, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":office_worker: [Job noises] :office_worker:")
        .setDescription(`${User}, the corporate people have rejected your job offer as a **${Job}**. <:3421_pepesadfriendhug:837463376548331560>`)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Job_Embed(Job, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":office_worker: [Job noises] :office_worker:")
        .setDescription(`${User}, you have a job as a **${Job}**.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "job",
    aliases: ["claimjob"],
    category: "currency",
    setup: "job [Job Name]",
    show_aliases: true,
    cooldown: 60000,
    description: "Want to get a job, you know what a job is right?",

    async execute(Message, Message_Args, Client) {
        if (Users_Database.Currency[Message.author.id].job) return Message.channel.send({embeds: [Job_Embed(Users_Database.Currency[Message.author.id].job, Message.author.toString())]});

        const Requested_Job = Message_Args.slice(0).join(" ");

        if (!Requested_Job) return Message.channel.send({embeds: [Ambulance_Embed("Please provide a job.")]});

        var Found_Job = false;
        var Job = null;

        Jobs.forEach(Gotten_Job => {
            if (Gotten_Job.Name.toLowerCase() === Requested_Job.toLowerCase()) {
                Job = Gotten_Job;
                Found_Job = true;
            };
        });

        if (Found_Job === false) return Message.channel.send({embeds: [Ambulance_Embed(`I could not find a job called **${Requested_Job}**.`)]});

        var Chance_1 = Math.floor(Math.random() * Job.Hire_Difficulty);
        var Chance_2 = Math.floor(Math.random() * Job.Hire_Difficulty);

        if (Job.Rank === 2 && Users_Database.Currency[Message.author.id].hours_worked >= 25) {
            Chance_1 = Math.floor(Chance_1 / 2);
            Chance_2 = Math.floor(Chance_2 / 2);
        } else if (Job.Rank === 3 && Users_Database.Currency[Message.author.id].hours_worked >= 500) {
            Chance_1 = Math.floor(Chance_1 / 10);
            Chance_2 = Math.floor(Chance_2 / 10);
        }

        if (Chance_1 === Chance_2) {
            Message.channel.send({embeds: [Hired_Embed(Job.Name, Message.author.toString())]});

            Users_Database.Currency[Message.author.id].job = Job.Name;
        } else {
            Message.channel.send({embeds: [Rejected_Embed(Job.Name, Message.author.toString())]});
        };
    }
};