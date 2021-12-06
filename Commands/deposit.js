const Discord = require("discord.js");
const fs = require("fs");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Bank_Ambulance_Embed = Global_Functions.Bank_Ambulance_Embed;

function Deposit_Embed(Amount, Current_Wallet_Balance, Current_Bank_Balance, User) {
    const Embed = new Discord.MessageEmbed().setTitle(":bank: [Bank noises] :bank:").setDescription(`${User}, you deposited **${Amount}**:coin: into your bank.\nYour current wallet balance is **${Current_Wallet_Balance}**:coin: and your current bank balance is **${Current_Bank_Balance}**:coin:.`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "deposit",
    aliases: ["moneygoinbank"],
    category: "currency",
    setup: "deposit [Amount]",
    show_aliases: true,
    cooldown: 10000,
    description: "Allows you to deposit money into your bank!",

    async execute(Message, Message_Args, Client) {
        let Amount = Message_Args[0];

        if (!Amount) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a amount.`)] });
        if (Amount.toLowerCase() === "all") Amount = Global_Databases.Users[Message.author.id].wallet;
        if (isNaN(Amount) || !parseInt(Amount)) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid amount.`)] });
        if (Amount > Global_Databases.Users[Message.author.id].wallet) return Message.channel.send({ embeds: [Bank_Ambulance_Embed(`${Message.author.toString()}, you dont have **${Amount}**:coin: to deposit.`)] });
        if (Amount < 1) return Message.channel.send({ embeds: [Bank_Ambulance_Embed(`${Message.author.toString()}, choose a amount greater than **1**:coin: to withdraw.`)] });

        Amount = parseInt(Math.floor(Amount));
        Global_Databases.Users[Message.author.id].wallet -= Amount;
        Global_Databases.Users[Message.author.id].bank += Amount;

        Message.channel.send({ embeds: [Deposit_Embed(Amount, Global_Databases.Users[Message.author.id].wallet, Global_Databases.Users[Message.author.id].bank, Message.author.toString())] });
    },
};
