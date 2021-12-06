const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;
const Moderation_Database = Global_Databases.Moderation;
const Button_Filter = (Interaction) => Interaction.customId === "warns_back" || Interaction.customId === "warns_next";

function Warns_Embed(Warn_String) {
    const Embed = new Discord.MessageEmbed().setTitle(":notepad_spiral: [Police Logs] :notepad_spiral:").setDescription(Warn_String).setColor(Global_Embed_Color);

    return Embed;
}

function Load_Warns(Guild, User, Is_Self, Warns, Start, End) {
    let String = `${User} ${Is_Self ? "you have" : "has"} **${Object.keys(Warns).length + (Object.keys(Warns).length === 1 ? " warn" : " warns")}**.`;

    for (var Current_Warn = Start; Current_Warn < End; Current_Warn++) {
        const Warn = Warns[Current_Warn];

        if (Warn) {
            const Moderator = Guild.members.cache.get(Warn.moderator);

            String = `${String}\n\n**Warn ${Current_Warn}**\nReason: ${Warn.reason}\nModerator: ${Moderator ? Moderator.toString() : `'${Warn.moderator}'`}`;
        }
    }

    return String;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("warns")
        .setDescription("Want to the a list of  do we?")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "moderation",
    permissions: "ADMINISTRATOR",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false, null, null, true);

        if (!Member) return;

        const Warns = Moderation_Database[Interaction.guild.id].warns[Member.id]?.warns ? Moderation_Database[Interaction.guild.id].warns[Member.id].warns : {};
        let Current_Embed = Warns_Embed(Load_Warns(Interaction.guild, Member.toString(), Member === Interaction.member, Warns, 0, 6));

        await Interaction.reply({ embeds: [Current_Embed], ephemeral: true });

        if (Object.keys(Warns).length <= 5) return;

        const Message_Components = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("warns_back").setLabel("<").setStyle("PRIMARY").setDisabled(true), new Discord.MessageButton().setCustomId("warns_next").setLabel(">").setStyle("PRIMARY"));
        let Current_Page = 1;
        const Current_Page_Embed = await Interaction.editReply({ embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Object.keys(Warns).length / 5 + (Object.keys(Warns).length % 5 === 0 ? 0 : 1))}`)], components: [Message_Components], fetchReply: true, ephemeral: true });
        const Button_Collector = await Current_Page_Embed.createMessageComponentCollector({
            Button_Filter,
            time: 120000,
        });

        Button_Collector.on("collect", async (Interaction) => {
            if (Interaction.customId === "warns_back") {
                Current_Page--;
                Message_Components.components[1].setDisabled(false);

                if (Current_Page === 1) Message_Components.components[0].setDisabled(true);
            } else if (Interaction.customId === "warns_next") {
                Current_Page++;
                Message_Components.components[0].setDisabled(false);

                if (Current_Page === Math.floor(Object.keys(Warns).length / 5 + (Object.keys(Warns).length % 5 === 0 ? 0 : 1))) Message_Components.components[1].setDisabled(true);
            }

            Current_Embed = Warns_Embed(Load_Warns(Interaction.guild, Member.toString(), Member === Interaction.member, Warns, Current_Page > 1 ? 5 * Current_Page - 4 : 1, Current_Page === 1 ? 5 * Current_Page + 1 : 5 * Current_Page + 1));

            await Interaction.deferUpdate();
            await Interaction.editReply({
                embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Object.keys(Warns).length / 5 + (Object.keys(Warns).length % 5 === 0 ? 0 : 1))}`)],
                components: [Message_Components],
                ephemeral: true,
            });

            Button_Collector.resetTimer();
        });

        Button_Collector.on("end", () => {
            if (Current_Page_Embed.deleted) return;

            Message_Components.components[0].setDisabled(true);
            Message_Components.components[1].setDisabled(true);
            Current_Page_Embed.edit({
                embeds: [Current_Embed.setFooter(`Page ${Current_Page}/${Math.floor(Object.keys(Warns).length / 5 + (Object.keys(Warns).length % 5 === 0 ? 0 : 1))}`)],
                components: [Message_Components],
                ephemeral: true,
            });
        });
    },
};
