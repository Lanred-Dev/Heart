const Discord = require("discord.js");
const Get_Toggle_Type = Global_Functions.Get_Toggle_Type;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Toggle, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription(`${Moderator} has ${Toggle === true ? "disabled" : "enabled"} the currency system.`)
        .setColor(Global_Embed_Color)
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "disablecurrency",
    aliases: ["currencytoggle"],
    category: "utility",
    setup: "disablecurrency [True/False]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Want to toggle the currency system in your server?",

    async execute(Message, Message_Args, Client) {
        const Toggle = Get_Toggle_Type(Message, Message_Args, 0, true);

        Message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle(":gear: [Gears turning] :gear:")
                    .setDescription(`I have ${Toggle === true ? "disabled" : "enabled"} the currency system for this server.`)
                    .setColor(Global_Embed_Color),
            ],
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel)
            Log_Channel.send({
                embeds: [Log_Embed(Toggle, Message.author.toString())],
            });

        Global_Databases.Moderation[Message.guild.id].currency_system = Toggle;
    },
};
