const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Shop = require("../Core/utils/Data/Shop.json");

function Buy_Embed(Item, Price) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":shopping_bags: Shop :shopping_bags:")
        .setDescription(`You bought **${Item}** for **${Price}**:coin:.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "buy",
    aliases: [],
    category: "currency",
    setup: "buy",
    show_aliases: true,
    description: "Want something?",

    async execute(Message, Message_Args, Client) {
        const Requested_Item = Message_Args.slice(0).join(" ");

        if (!Requested_Item) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a item name.`)]});

        var Found_Item = false;
        var Item = null;

        Shop.forEach(Gotten_Item => {
            if (Gotten_Item.Name.toLowerCase() === Requested_Item.toLowerCase()) {
                Item = Gotten_Item;
                Found_Item = true;
            };
        });

        if (Found_Item === false) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find a shop item called **${Requested_Item}**.`)]});
        if (Item.Price > Users_Database.Currency[Message.author.id].wallet) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have **${Item.Price}**:coin: in your wallet to buy **${Requested_Item}**.`)]});

        Message.channel.send({embeds: [Buy_Embed(Item.Name, Item.Price)]});

        Users_Database.Currency[Message.author.id].wallet -= Item.Price;
        Users_Database.Currency[Message.author.id].inventory.push({
            name: Item.Name,
            emoji: Item.Emoji,
            description: Item.Description,
            price: Item.Price
        });
    }
};