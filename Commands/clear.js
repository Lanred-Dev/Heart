const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Error_Embed = Global_Functions.Error_Embed;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Amount, Channel, Moderator) {
    const Embed = new Discord.MessageEmbed().setTitle("🛡️ Moderator Action 🛡️").setDescription(`${Moderator} cleared **${Amount} messages** in ${Channel}.`).setColor(Global_Embed_Color).setTimestamp(new Date()).setFooter("❤ Log");

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Will delete the amount of messages requested.")
        .addIntegerOption((Option) => Option.setName("amount").setDescription("The amount to clear").setRequired(true)),
    category: "moderation",
    permissions: "ADMINISTRATOR",

    async execute(Interaction, Client) {
        const Amount = Interaction.options.getInteger("amount");

        if (Amount > 100) return Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, provide a amount less than 100.`)] });
        if (Amount < 2) return Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, provide a amount greater than 2.`)] });

        Interaction.delete();

        Interaction.channel.messages
            .fetch({
                limit: Amount,
            })
            .catch(() => {
                Interaction.reply({
                    embeds: [Ambulance_Embed(`${Interaction.user.toString()}, I could not delete **${Amount} messages**. This is most likely because some of the message are older than 14 days.`)],
                });
            })
            .then((Gotten_Messages) => {
                try {
                    Interaction.channel.bulkDelete(Gotten_Messages);

                    setTimeout(function () {
                        Interaction.reply({embeds: [new Discord.MessageEmbed().setTitle("🚨 [Police Siren] 🚨").setDescription(`**${Amount} messages** have been deleted.`).setColor(Global_Embed_Color)]});

                        const Log_Channel = Get_Server_Log_Channel(Interaction.guild);

                        if (Log_Channel) Log_Channel.send({ embeds: [Log_Embed(Amount, Interaction.channel, Interaction.user.toString())] });
                    }, 1000);
                } catch (Error) {
                    Interaction.reply({ embeds: [Error_Embed(Error)] });
                }
            });
    },
};
