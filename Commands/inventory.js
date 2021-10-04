const DiscordAPI = require("discord.js");

function Inventory_Embed(Status, Networth) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":shopping_bags: Inventory :shopping_bags:")
        .setDescription(Status)
        .setFooter(`You have a networth of ${Networth}.`)
        .setColor(Global_Embed_Color);

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
        var Status = "";
        var Networth = 0;

        if (Users_Database.Currency[Message.author.id].inventory.length <= 0) {
            Status = "You have no items in your **inventory**.";
        } else {
            Status = `${Message.author.toString()}, you have **${Users_Database.Currency[Message.author.id].inventory.length}** items in your inventory.`;

            Users_Database.Currency[Message.author.id].inventory.forEach(Item => {
                Status = `${Status}\n\n${Item.emoji} **${Item.name}**${Item.description != null ? `\nDescription: ${Item.description}` : ""}${Item.price != null ? `\nPrice: ${Item.price}:coin:` : ""}`;

                if (Item.price && parseInt(Item.price)) {
                    Networth += parseInt(Item.price);
                }
            });
        };

        Message.channel.send({embeds: [Inventory_Embed(Status, Networth)]});
    }
};