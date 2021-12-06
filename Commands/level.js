const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;

function Levels_Disabled_Ambulance_Embed() {
    const Embed = new Discord.MessageEmbed().setTitle(":lock: [Locked noises] :lock:").setDescription("Levels have been disabled in this server.").setColor(Global_Embed_Color);

    return Embed;
}

function Level_Embed(Level, XP, Messages, User) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":mag: [Level noises] :mag:")
        .setDescription(`${User}, you are level **${Level}**!`)
        .setFooter(`❤ Next level at ${Levels_Reach[Level + 1]} XP`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "level",
    aliases: [],
    category: "fun",
    setup: "level",
    show_aliases: true,
    description: "Want to see your level in the server? Yea yea we knew.",

    async execute(Message, Message_Args, Client) {
        if (Global_Databases.Moderation[Message.guild.id].level_system.enabled === false) return Message.channel.send({ embeds: [Levels_Disabled_Ambulance_Embed()] });

        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        const Stats = Global_Databases.Users.Levels[Message.guild.id][Message.author.id];

        if (!Stats) return Message.channel.send({ embeds: [Ambulance_Embed(`<:3421_pepesadfriendhug:837463376548331560> ${Message.author.toString()}, I was unable to find anything for ${Member === Message.member ? "you" : Member.toString()}. <:3421_pepesadfriendhug:837463376548331560>`)] });

        Message.channel.send({ embeds: [Level_Embed(Stats.level, Stats.xp, Stats.messages, Message.author.toString())] });
    },
};
