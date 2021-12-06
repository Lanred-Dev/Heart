const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Shop = require("../Core/utils/Data/Shop.json");
const Items = require("../Core/utils/Data/Items.json");

function Buy_Embed(Item, Price) {
    const Embed = new Discord.MessageEmbed().setTitle(":shopping_bags: Shop :shopping_bags:").setDescription(`You bought **${Item}** for **${Price}**:coin:.`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "buy",
    aliases: [],
    category: "currency",
    setup: "buy [Item]",
    show_aliases: true,
    description: "Want something out of the shop?",

    async execute(Message, Message_Args, Client) {
        const Requested_Item = Message_Args.slice(0).join(" ").toLowerCase();

        if (!Requested_Item) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a item.`)] });

        const Shop_Item = Shop.find(Item => Item.toLowerCase() === Requested_Item);
        
        if (!Shop_Item) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find a item in the shop called **${Requested_Item}**.`)] });

        const Item = Items.find(Item => Item.Name.toLowerCase() === Requested_Item);

        if (!Item) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, there is not item called **${Requested_Item}**.`)] });
        if (Item.Price > Global_Databases.Users[Message.author.id].wallet) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have **${Item.Price}**:coin: in your wallet to buy **${Requested_Item}**.`)] });

        Message.channel.send({ embeds: [Buy_Embed(Item.Name, Item.Price)] });

        Global_Databases.Users[Message.author.id].wallet -= Item.Price;
        Global_Databases.Users[Message.author.id].inventory.push(Item.Name.toLowerCase());
    },
};
