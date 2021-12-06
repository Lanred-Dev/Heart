const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Log_Embed(New_Channel, Old_Channel, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription(`${Moderator} has ${Old_Channel === null ? "set" : "updated"} the log channel.`)
        .setColor(Global_Embed_Color)
        .addFields(
            {
                name: "Old Channel",
                value: `${Old_Channel ? Old_Channel : "**none**"}`,
                inline: true,
            },
            {
                name: "New Channel",
                value: `${New_Channel ? New_Channel : "**none**"}`,
                inline: true,
            }
        )
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "logchannel",
    aliases: [],
    category: "utility",
    setup: "logchannel [Channel Name]",
    show_aliases: false,
    permissions: "ADMINISTRATOR",
    description: "Sets the log channel for logging moderation actions.",

    async execute(Message, Message_Args, Client, Command) {
        const Channel_Name = Message_Args.slice(0).join(" ") || null;
        let Channel;

        if (Channel_Name === Global_Databases.Moderation[Message.guild.id].log_channel) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a new channel name.`)] });

        if (Channel_Name) {
            Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                return Gotten_Channel.name.toLowerCase() === Channel_Name.toLowerCase();
            });

            if (!Channel)
                return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find a channel called **${Channel_Name}**.`)],
                });

            Channel.send({
                embeds: [Log_Embed(Channel, Global_Databases.Moderation[Message.guild.id].log_channel, Message.author.toString())],
            });
        }

        Message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle(":gear: [Gears turning] :gear:")
                    .setDescription(`The log channel has been ${Global_Databases.Moderation[Message.guild.id].log_channel === null ? "set" : "updated"} to ${Channel ? Channel : "**none**"}.`)
                    .setColor(Global_Embed_Color),
            ],
        });

        Global_Databases.Moderation[Message.guild.id].log_channel = Channel_Name;
    },
};
