const DiscordAPI = require("discord.js");
const Get_Toggle_Type = Global_Functions.Get_Toggle_Type;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Toggle, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription(`${Moderator} has ${Toggle === true ? "disabled" : "enabled"} the level system.`)
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
    name: "disablelevels",
    aliases: [],
    category: "utility",
    setup: "disablelevels [True/False]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Want to disable the level system in your server?",

    async execute(Message, Message_Args, Client) {
        const Toggle = Get_Toggle_Type(Message, Message_Args, 0, true);

        Message.channel.send({
            embeds: [
                new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription(`I have ${Toggle === true ? "disabled" : "enabled"} the level system.`)
                .setColor(Global_Embed_Color)
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embeds: [Log_Embed(Toggle, Message.author.toString())]
        });

        Moderation_Database[Message.guild.id].level_system.enabled = Toggle;
    }
};