const DiscordAPI = require("discord.js");

function Wallet_Embed(Current_Balance, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("👛 Wallet Balance 👛")
        .setDescription(`${User}, your current wallet balance is **${Current_Balance}**:coin:.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "wallet",
    aliases: ["walletbalance"],
    category: "currency",
    setup: "wallet",
    show_aliases: true,
    description: "Lists the amount of money in your wallet!",

    async execute(Message, Message_Args, Client) {
        Message.channel.send({embeds: [Wallet_Embed(Users_Database.Currency[Message.author.id].wallet, Message.author.toString())]});
    }
};