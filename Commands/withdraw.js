const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Bank_Ambulance_Embed = Global_Functions.Bank_Ambulance_Embed;
const User_Database = Global_Databases.Users;

function Withdraw_Embed(Amount, Current_Wallet_Balance, Current_Bank_Balance, User) {
    const Embed = new Discord.MessageEmbed().setTitle(":bank: [Bank noises] :bank:").setDescription(`${User}, you withdrew **${Amount}**:coin: from your bank.\nYour current wallet balance is **${Current_Wallet_Balance}**:coin: and your current bank balance is **${Current_Bank_Balance}**:coin:.`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Allows you to withdraw money out of your bank!")
        .addIntegerOption((Option) => Option.setName("amount").setDescription("The amount to withdraw").setRequired(true)),
    category: "currency",
    cooldown: 10000,

    async execute(Interaction, Client) {
        const Amount = Interaction.options.getInteger("amount");

        if (Amount > User_Database[Interaction.author.id].bank) return Interaction.reply({ embeds: [Bank_Ambulance_Embed(`${Interaction.author.toString()}, you dont have **${Amount}**:coin: in your bank to withdraw.`)] });
        if (Amount < 1) return Interaction.reply({ embeds: [Bank_Ambulance_Embed(`${Interaction.author.toString()}, choose a amount greater than **1**:coin: to withdraw.`)] });

        User_Database[Interaction.author.id].bank -= Amount;
        User_Database[Interaction.author.id].wallet += Amount;

        Interaction.reply({ embeds: [Withdraw_Embed(Amount, User_Database[Interaction.author.id].wallet, User_Database[Interaction.author.id].bank, Interaction.author.toString())] });
    },
};
