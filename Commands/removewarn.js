const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;
const Moderation_Database = Global_Databases.Moderation;

function Remove_Warn_Embed(Reason, Warn, Moderator, Server) {
    const Embed = new Discord.MessageEmbed().setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:").setDescription(`Warn ${Warn} has been removed in **${Server}** by ${Moderator}.`).setColor(Global_Embed_Color).addFields({
        name: "Warn Reason",
        value: Reason,
        inline: true,
    });

    return Embed;
}

function Log_Embed(Reason, Warn, User, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`Warn ${Warn} has been removed from ${User} by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Warn Reason",
            value: Reason,
            inline: true,
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Dont want a user to have a warn, I see.")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(true))
        .addIntegerOption((Option) => Option.setName("key").setDescription("The warn key").setRequired(true)),
    category: "moderation",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, false, true, "you cant remove a warn from yourself", "you cant remove a warn from fellow admins", true);

        if (!Member) return;

        const Key = Interaction.options.getInteger("key");
        const Warn = Moderation_Database[Interaction.guild.id].warns[Member.id]?.warns[Key];

        if (!Warn)
            return Interaction.reply({
                embeds: [Ambulance_Embed(`${Interaction.author.toString()}, that is not a valid warn key for ${Member.toString()}.`)],
                ephemeral: true,
            });

        try {
            Member.send({ embeds: [Remove_Warn_Embed(Warn.reason, Key, `${Interaction.user.username}#${Interaction.user.discriminator}`, Interaction.guild.name)] });
        } catch (Error) {}

        Interaction.reply({
            embeds: [new Discord.MessageEmbed().setTitle(":notepad_spiral: [Tearing noises] :notepad_spiral:").setDescription(`${Member.toString()}'s warn has been removed.`).setColor(Global_Embed_Color)],
            ephemeral: true,
        });

        const Log_Channel = Get_Server_Log_Channel(Interaction.guild);

        if (Log_Channel) Log_Channel.send({ embeds: [Log_Embed(Warn.reason, Key, Member.tag, Interaction.author.toString())] });

        delete Moderation_Database[Interaction.guild.id].warns[Member.id].warns[Key];
    },
};
