const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Member = Global_Functions.Get_Member;
const Moderation_Database = Global_Databases.Moderation;

function Warn_Embed(Warn_String) {
    const Embed = new Discord.MessageEmbed().setTitle(":notepad_spiral: [Police Logs] :notepad_spiral:").setDescription(Warn_String).setColor(Global_Embed_Color);

    return Embed;
}

function Load_Warn(Guild, User, Warn, Key) {
    const Moderator = Guild.members.cache.get(Warn.moderator);

    return `**Warn ${Key}'s** info for ${User.toString()}.\n\nReason: ${Warn.reason}\nModerator: ${Moderator ? Moderator.toString() : `'${User_Warns.warns[Current_Warn].moderator}'`}`;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("warninfo")
        .setDescription("Will list the info of the requested warn.")
        .addIntegerOption((Option) => Option.setName("key").setDescription("The warn key").setRequired(true))
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "moderation",
    permissions: "ADMINISTRATOR",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false, null, null, true);

        if (!Member) return;
        if (!Moderation_Database[Interaction.guild.id].warns[Member.id]) return Interaction.reply({ embeds: [Ambulance_Embed(`${Member} has no warns.`)], ephemeral: true });

        const Key = Interaction.options.getInteger("key");
        const Warn = Moderation_Database[Interaction.guild.id].warns[Member.id]?.warns[Key];

        if (!Warn) return Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.author.toString()}, that is not a valid warn key for ${Member.toString()}.`)], ephemeral: true });

        Interaction.reply({ embeds: [Warn_Embed(Load_Warn(Interaction.guild, Member, Warn, Key))], ephemeral: true });
    },
};
