const DiscordAPI = require("discord.js");

function Bank_Embed(Current_Balance, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":bank: Bank Balance :bank:")
        .setDescription(`${User}, your current bank balance is **${Current_Balance}**:coin:.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "bank",
    aliases: ["bal"],
    category: "currency",
    setup: "bank",
    show_aliases: true,
    description: "Lists the amount of money in your bank!",

    async execute(Message, Message_Args, Client) {
        Message.channel.send({embeds: [Bank_Embed(Users_Database.Currency[Message.author.id].bank, Message.author.toString())]});
    }
};