const DiscordAPI = require("discord.js");
const Shop = require("../Core/utils/Data/Shop.json");

function Shop_Embed(Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":shopping_bags: Shop :shopping_bags:")
        .setDescription(Status)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "shop",
    aliases: [],
    category: "currency",
    setup: "shop",
    show_aliases: true,
    description: "Want to shop?",

    async execute(Message, Message_Args, Client) {
        var Status = "";

        if (Shop.length <= 0) {
            Status = "Strange, there are no items in the shop.";
        } else {
            Status = `${Message.author.toString()}, there are **${Shop.length}** items in the shop today.`;

            Shop.forEach(Item => {
                Status = `${Status}\n\n${Item.Emoji} **${Item.Name}**\n Price: ${Item.Price}:coin:\n Description: ${Item.Description}`;
            });
        };

        Message.channel.send({embeds: [Shop_Embed(Status)]});
    }
};