const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Levels_Disabled_Ambulance_Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":lock: [Locked noises] :lock:")
        .setDescription("Levels have been disabled in this server.")
        .setColor(Global_Embed_Color);

    return Embed;
}

function Level_Embed(Level, XP, Messages, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":mag: [Level noises] :mag:")
        .setDescription(`${User}, you are level **${Level}**!`)
        .addFields({
            name: ":mag: Next Level At :mag:",
            value: `${Levels_Reach[Level + 1]} XP`,
            inline: true
        }, {
            name: "⛏️ XP Earned ⛏️",
            value: XP,
            inline: true
        }, {
            name: ":envelope: Messages Sent/Counted :envelope:",
            value: Messages,
            inline: true
        })
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "level",
    aliases: ["mylevel", "userlevel", "rank"],
    category: "fun",
    setup: "level",
    show_aliases: true,
    description: "Want to see your level/rank? Then use this command!",

    async execute(Message, Message_Args, Client) {
        if (Moderation_Database.Level_System[Message.guild.id].enabled === false) return Message.channel.send({embeds: [Levels_Disabled_Ambulance_Embed()]});

        const User = Message.mentions.users.first();

        if (User) {
            const Member = Message.guild.member(User);

            if (!Member) return Message.channel.send({embeds: [Ambulance_Embed(`${Member.toString()} is not in this guild.`)]});

            const Stats = Users_Database.Levels[Message.guild.id][Member.id];

            if (!Stats) return Message.channel.send({embeds: [Ambulance_Embed(`Sorry but I was unable to find anything for ${Member.toString()} <:3421_pepesadfriendhug:837463376548331560>, maybe they have never sent a message.`)]});

            Message.channel.send({embeds: [Level_Embed(Stats.level, Stats.xp, Stats.messages, Member.toString())]});
        } else {
            const Stats = Users_Database.Levels[Message.guild.id][Message.author.id];

            if (!Stats) return Message.channel.send({embeds: [Ambulance_Embed("Sorry but I was unable to find anything for you. <:3421_pepesadfriendhug:837463376548331560>")]});

            Message.channel.send({embeds: [Level_Embed(Stats.level, Stats.xp, Stats.messages, Message.author.toString())]});
        };
    }
};