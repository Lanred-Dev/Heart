const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Jobs = require("../Core/utils/Data/Jobs.json");
const Button_Filter = (Interaction) => Interaction.customId === "jobs_back" || Interaction.customId === "jobs_next";

function Jobs_Embed(Job_List_String, Current_Page, Page_Amount) {
    const Embed = new Discord.MessageEmbed().setTitle(":office_worker: Looking for a job are we? :office_worker:").setDescription(Job_List_String).setColor(Global_Embed_Color).setFooter(`❤ Page ${Current_Page}/${Page_Amount}`);

    return Embed;
}

function Load_Jobs(Start, End) {
    let String = null;

    Jobs.filter((_, Index) => Index >= Start && Index < End).forEach((Job) => {
        String = `${String ? `${String}\n\n` : ""}${Job.Emoji} **${Job.Name}**\nAverage Pay: ${Job.Pay}:coin:\nHire Difficulty: ${Job.Hire_Difficulty}`;
    });

    return String;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("jobs")
        .setDescription("You dont know all the jobs or just want to see them?"),
    category: "currency",

    async execute(Interaction, Client) {
        let Current_Embed = Jobs_Embed(Load_Jobs(0, 5));

        await Interaction.reply({ embeds: [Current_Embed] });
    
        if (Jobs.length <= 5) return;

        const User_ID = Interaction.user.id;
        const Message_Components = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("jobs_back").setLabel("<").setStyle("PRIMARY").setDisabled(true), new Discord.MessageButton().setCustomId("jobs_next").setLabel(">").setStyle("PRIMARY"));
        let Current_Page = 1;
        const Current_Page_Embed = await Interaction.editReply({ embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Jobs.length / 5 + (Jobs.length % 5 === 0 ? 0 : 1))}`)], components: [Message_Components], fetchReply: true, ephemeral: true });
        const Button_Collector = await Current_Page_Embed.createMessageComponentCollector({
            Button_Filter,
            time: 120000,
        });

        Button_Collector.on("collect", async (Interaction) => {
            if (Interaction.user.id !== User_ID) return;

            if (Interaction.customId === "jobs_back") {
                Current_Page--;
                Message_Components.components[1].setDisabled(false);

                if (Current_Page === 1) Message_Components.components[0].setDisabled(true);
            } else if (Interaction.customId === "jobs_next") {
                Current_Page++;
                Message_Components.components[0].setDisabled(false);

                if (Current_Page === Math.floor(Jobs.length / 5 + (Jobs.length % 5 === 0 ? 0 : 1))) Message_Components.components[1].setDisabled(true);
            }

            Current_Embed = Jobs_Embed(Load_Jobs(Current_Page > 1 ? 5 * Current_Page - 4 : 1, Current_Page === 1 ? 5 * Current_Page + 1 : 5 * Current_Page + 1));

            await Interaction.deferUpdate();
            await Interaction.editReply({
                embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Jobs.length / 5 + (Jobs.length % 5 === 0 ? 0 : 1))}`)],
                components: [Message_Components],
            });

            Button_Collector.resetTimer();
        });

        Button_Collector.on("end", () => {
            if (Current_Page_Embed.deleted) return;

            Message_Components.components[0].setDisabled(true);
            Message_Components.components[1].setDisabled(true);
            Current_Page_Embed.edit({
                embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Jobs.length / 5 + (Jobs.length % 5 === 0 ? 0 : 1))}`)],
                components: [Message_Components],
            });
        });
    },
};
