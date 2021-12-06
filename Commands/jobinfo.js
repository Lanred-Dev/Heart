const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Jobs = require("../Core/utils/Data/Jobs.json");

function Job_Embed(Job) {
    const Embed = new Discord.MessageEmbed().setTitle(`${Job.Emoji} ${Job.Name}`).setDescription(`${Job.Status}\n\nJob Rank: **${Job.Rank}**\nPay: **${Job.Pay}**:coin:\nHire Difficulty: **${Job.Hire_Difficulty}**`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("jobinfo")
        .setDescription("Will list the info of the requested job, I mean thats all.")
        .addStringOption((Option) => Option.setName("job").setDescription("The job").setRequired(true)),
    category: "currency",

    async execute(Interaction, Client) {
        const Requested_Job = Interaction.options.getString("job").toLowerCase();
        const Job = Jobs.find((Job) => Job.Name.toLowerCase() === Requested_Job);

        if (!Job) return Interaction.reply({ embeds: [Ambulance_Embed(`${Message.user.toString()}, I could not find a job called **${Requested_Job}**.`)] });

        Interaction.reply({ embeds: [Job_Embed(Job)] });
    },
};
