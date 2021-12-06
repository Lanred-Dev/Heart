const Discord = require("discord.js");
const Get_Member = Global_Functions.Get_Member;
const Moderation_Database = Global_Databases.Moderation;

function Clear_Embed(Moderator, Server) {
    const Embed = new Discord.MessageEmbed().setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:").setDescription(`Your warns have been removed from ${Server} by ${Moderator}.`).setColor(Global_Embed_Color);

    return Embed;
}

function Log_Embed(User, Moderator) {
    const Embed = new Discord.MessageEmbed().setTitle("🛡️ Moderator Action 🛡️").setDescription(`${Moderator} cleared ${User}'s warns.`).setColor(Global_Embed_Color).setTimestamp(new Date()).setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "clearwarns",
    aliases: ["removewarns"],
    category: "moderation",
    setup: "clearwarns [User]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "This command will warn a user!",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (!Moderation_Database[Message.guild.id].warns[Member.id])
            Moderation_Database[Message.guild.id].warns[Member.id] = {
                warns: {},
                amount: 0,
            };

        Member.send({
            embeds: [Clear_Embed(Message.author.toString(), Message.guild.name)],
        }).catch();

        Message.channel.send({
            embeds: [new Discord.MessageEmbed().setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:").setDescription(`${Member.toString()}'s warns have been removed.`).setColor(Global_Embed_Color)],
        });
        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel)
            Log_Channel.send({
                embeds: [Log_Embed(Member.tag, Message.author.toString())],
            });

        Moderation_Database[Message.guild.id].warns[Member.id].amount = Moderation_Database[Message.guild.id].warns[Member.id].amount = 0;
        Moderation_Database[Message.guild.id].warns[Member.id].warns = {};
    },
};
