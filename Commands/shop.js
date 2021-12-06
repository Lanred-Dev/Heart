const Discord = require("discord.js");
const Items = require("../Core/utils/Data/Items.json");
const Shop = require("../Core/utils/Data/Shop.json");

function Embed(Status) {
    const Embed = new Discord.MessageEmbed().setTitle(":shopping_bags: Shop :shopping_bags:").setDescription(Status).setColor(Global_Embed_Color);

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
        let Status = "";

        if (Shop.length <= 0) {
            Status = "Strange, there are no items in the shop.";
        } else {
            Status = `${Message.author.toString()}, there are **${Shop.length}** items in the shop today.`;

            Shop.forEach((Item) => {
                Item = Items.find(Gotten_Item => Gotten_Item.Name.toLowerCase() === Item.toLowerCase());

                if (!Item) return;

                Status = `${Status}\n\n${Item.Emoji} **${Item.Name}**\n Price: ${Item.Price}:coin:\n Description: ${Item.Description}`;
            });
        }

        Message.channel.send({ embeds: [Embed(Status)] });
    },
};
