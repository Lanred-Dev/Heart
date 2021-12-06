const Discord = require("discord.js");
const Items = require("../Core/utils/Data/Items.json");

function Inventory_Embed(Status) {
    const Embed = new Discord.MessageEmbed().setTitle(":shopping_bags: Inventory :shopping_bags:").setDescription(Status).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "inventory",
    aliases: ["backpack", "inv"],
    category: "currency",
    setup: "inventory",
    show_aliases: true,
    description: "Lists all the items in your inventory!",

    async execute(Message, Message_Args, Client) {
        let Status = "";

        if (Global_Databases.Users[Message.author.id].inventory.length <= 0) {
            Status = "You have no items in your **inventory**.";
        } else {
            let Items_String = "";
            let Networth = 0;

            Global_Databases.Users[Message.author.id].inventory.forEach((Item) => {
                Item = Items.find(Gotten_Item => Gotten_Item.Name.toLowerCase() === Item.toLowerCase());

                if (!Item) return;

                Items_String = `${Items_String}\n\n${Item.Emoji} **${Item.Name}**${Item.Description ? `\nDescription: ${Item.Description}` : ""}${Item.Price ? `\nPrice: ${Item.Price}:coin:` : ""}`;
                Networth += Item.Price && Item.Price > 0 ? Item.Price : 0;
            });

            Status = `${Message.author.toString()}, you have **${Global_Databases.Users[Message.author.id].inventory.length}** items in your inventory and a networth of **${Networth}**:coin:.${Items_String}`;
        }

        Message.channel.send({ embeds: [Inventory_Embed(Status)] });
    },
};
