const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Bank_Ambulance_Embed = Global_Functions.Bank_Ambulance_Embed;

function Withdraw_Embed(Amount, Current_Wallet_Balance, Current_Bank_Balance, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":bank: [Bank noises] :bank:")
        .setDescription(`${User}, you withdrew **${Amount}**:coin: from your bank.\nYour current wallet balance is **${Current_Wallet_Balance}**:coin: and your current bank balance is **${Current_Bank_Balance}**:coin:.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "withdraw",
    aliases: ["moneygooutofbank", "withdrawl"],
    category: "currency",
    setup: "withdraw [Amount]",
    show_aliases: true,
    cooldown: 10000,
    description: "Allows you to withdraw money out of your bank!",

    async execute(Message, Message_Args, Client) {
        var Amount = Message_Args[0];

        if (!Amount) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a amount.`)]});
        if (Amount.toLowerCase() === "all") Amount = Users_Database.Currency[Message.author.id].bank;
        if (isNaN(Amount) || !parseInt(Amount)) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid amount.`)]});
        if (Amount > Users_Database.Currency[Message.author.id].bank) return Message.channel.send({embeds: [Bank_Ambulance_Embed(`${Message.author.toString()}, you dont have **${Amount}**:coin: in your bank to withdraw.`)]});
        if (Amount < 1) return Message.channel.send({embeds: [Bank_Ambulance_Embed(`${Message.author.toString()}, choose a amount greater than **1**:coin: to withdraw.`)]});

        Amount = parseInt(Math.floor(Amount));
        Users_Database.Currency[Message.author.id].bank -= Amount;
        Users_Database.Currency[Message.author.id].wallet += Amount;

        Message.channel.send({embeds: [Withdraw_Embed(Amount, Users_Database.Currency[Message.author.id].wallet, Users_Database.Currency[Message.author.id].bank, Message.author.toString())]});
    }
};