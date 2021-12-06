const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Member = Global_Functions.Get_Member;
const User_Database = Global_Databases.Users;

function Bank_Embed(Bank_Balance, Wallet_Balance, User, Is_User, Server) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":coin: Balance :coin:")
        .setDescription(`${Is_User ? `${User.toString()}, your` : `${User.toString()}'s`} combined balance is **${Is_User || Bank_Balance ? `${Bank_Balance + Wallet_Balance}:coin:` : "unknown"}**.`)
        .setColor(Global_Embed_Color)
        .setFooter(`${Is_User ? "Your" : `${User.tag}'s`} rank in ${Server} is #1`)
        .addFields(
            {
                name: "Wallet",
                value: `${Wallet_Balance}:coin:`,
                inline: true,
            },
            {
                name: "Bank",
                value: Is_User || Bank_Balance ? `${Bank_Balance}:coin:` : "---",
                inline: true,
            }
        );

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("I mean if you want to see the money, then yes.")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(false)),
    category: "currency",

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, true, false);

        if (!Member) return;
        if (!User_Database[Member.id]) return Interaction.reply({ embeds: [Ambulance_Embed(`<:3421_pepesadfriendhug:837463376548331560> ${Interaction.user.toString()}, I was unable to find anything for ${Member === Interaction.member ? "you" : Member.toString()}.`)] });

        const Is_Self = Interaction.member === Member;

        Interaction.reply({ embeds: [Bank_Embed(Is_Self ? User_Database[Member.id].bank : null, User_Database[Member.id].wallet, Member.user, Is_Self, Interaction.guild.name)] });
    },
};
