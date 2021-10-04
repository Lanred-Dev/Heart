const DiscordAPI = require('discord.js');
const imageAPI = require("imageapi.js");
const Reddits = ["meme", "NLSSCircleJerk", "memes", "MemeEconomy", "ComedyCemetery", "dankmemes"];

function Meme_Embed(Meme, Sub_Reddit) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setImage(Meme)
        .setColor(Global_Embed_Color)
        .setURL(`https://www.redit.com/r/${Sub_Reddit}}`)
        .setFooter(`❤ Meme • r/${Sub_Reddit}`);

    return Embed;
}

async function Get_Meme(Sub_Reddit) {
    return await imageAPI(Sub_Reddit);
}

module.exports = {
    name: "rmeme",
    aliases: ["randommeme"],
    category: "meme",
    setup: "rmeme",
    show_aliases: true,
    description: "Will get ya a meme.",

    async execute(Message, Message_Args, Client) {
        const Chosen_Reddit = Reddits[Math.floor(Math.random() * Reddits.length)];
        const Random_Meme = await Get_Meme(Chosen_Reddit);

        if (Random_Meme === null) Random_Meme = await Get_Meme(Chosen_Reddit);

        Message.channel.send({embeds: [Meme_Embed(Random_Meme, Chosen_Reddit)]});
    }
};