const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Amount, Channel, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`**${Amount}** messages have been cleared in ${Channel}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "clear",
    aliases: ["clearmessages"],
    category: "moderation",
    setup: "clear [Amount]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Will delete the amount of messages requested.",

    async execute(Message, Message_Args, Client) {
        const Amount = isNaN(Message_Args.slice(0).join(" ")) != null ? parseInt(Message_Args.slice(0).join(" ")) : null;

        if (!Amount) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a amount.`)]
        });
        if (isNaN(Amount)) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid amount.`)]
        });
        if (Amount > 100) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a amount less than 100.`)]
        });
        if (Amount < 2) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a amount greater than 2.`)]
        });

        Message.delete();

        Message.channel.messages
            .fetch({
                limit: Amount
            })
            .catch(() => {
                Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not delete **${Amount}** messages. This is most likely because some of the message are older than 14 days.`)]
                });
            })
            .then(Gotten_Messages => {
                var Errored = false;

                Message.channel.bulkDelete(Gotten_Messages)
                    .catch(() => {
                        Errored = true;

                        Message.channel.send({
                            embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not delete **${Amount}** messages. This is most likely because some of the message are older than 14 days.`)]
                        });
                    });

                setTimeout(function () {
                    if (Errored === true) return;

                    Message.channel.send({
                        embeds: [
                            new DiscordAPI.MessageEmbed()
                            .setTitle("🚨 [Police Siren] 🚨")
                            .setDescription(`**${Amount}** messages have been deleted.`)
                            .setColor(Global_Embed_Color)
                        ]
                    });

                    const Log_Channel = Get_Server_Log_Channel(Message.guild);

                    if (Log_Channel) Log_Channel.send({
                        embeds: [Log_Embed(Amount, Message.channel, Message.author.toString())]
                    });
                }, 1000);
            });
    }
};