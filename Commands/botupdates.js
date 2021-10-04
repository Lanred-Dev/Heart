const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Toggle_Type = Global_Functions.Get_Toggle_Type;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Toggle_Log_Embed(Toggle, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription(`${Moderator} has ${Toggle === true ? "enabled" : "disabled"} bot updates.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Enabled",
            value: Toggle,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

function Channel_Log_Embed(New_Channel, Old_Channel, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription(`${Moderator} has ${Old_Channel === null ? "set" : "updated"} the log channel.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Old Channel",
            value: `${Old_Channel != null ? Old_Channel : "**none**"}`,
            inline: true
        }, {
            name: "New Channel",
            value: `${New_Channel != null ? New_Channel : "**none**"}`,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "botupdates",
    aliases: [],
    category: "utility",
    setup: "botupdates [True/False] [Channel Name(True only)]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Want to see when Heart gets a update?",

    async execute(Message, Message_Args, Client) {
        const Toggle = Get_Toggle_Type(Message, Message_Args, 0, false);
        var Channel_Name = null;

        if (!Toggle) return;

        if (Toggle === true) {
            Channel_Name = Message_Args[1];

            if (Channel_Name === Moderation_Database[Message.guild.id].bot_updates.channel) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a new channel name.`)]});

            if (!Channel_Name) return Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a channel name.`)]
            });

            const Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                return Gotten_Channel.name.toLowerCase() === Channel_Name.toLowerCase();
            });

            if (!Channel) return Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find a **${Channel_Name}** channel.`)]
            });

            Channel.send({
                embeds: [
                    new DiscordAPI.MessageEmbed()
                    .setTitle(":wrench: I am the new update channel :wrench:")
                    .setDescription("I am new the new update channel! All bot updates(and downtime messages) will be sent here.")
                    .setColor(Global_Embed_Color)
                ]
            });
        }

        Message.channel.send({
            embeds: [
                new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription(`Bot updates have been ${Toggle === true ? "enabled" : "disabled"} ${Toggle === true ? ` and the channel has been ${Moderation_Database[Message.guild.id].bot_updates.channel === null ? "set" : "updated"}` : ``}.`)
                .setColor(Global_Embed_Color)
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) {
            Log_Channel.send({
                embeds: [Toggle_Log_Embed(Toggle, Message.author.toString())]
            });

            if (Toggle === true) {
                Log_Channel.send({
                    embeds: [Channel_Log_Embed(Channel, Moderation_Database[Message.guild.id].bot_updates.channel, Message.author.toString())]
                });
            }
        }

        Moderation_Database[Message.guild.id].bot_updates.enabled = Toggle;
        Moderation_Database[Message.guild.id].bot_updates.channel = Channel_Name;
    }
};