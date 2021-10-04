const DiscordAPI = require('discord.js');
const imageAPI = require("imageapi.js");
const Reddits = ["aww"];

function Post_Embed(Cute, Sub_Reddit) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setImage(Cute)
        .setColor(Global_Embed_Color)
        .setURL(`https://new.redit.com/r/${Sub_Reddit}}`)
        .setFooter(`❤ Cute Post • r/${Sub_Reddit}`);

    return Embed;
}

async function Get_Post(Sub_Reddit) {
    return await imageAPI(Sub_Reddit);
};

module.exports = {
    name: "cutepost",
    aliases: ["cutemoment", "rcute"],
    category: "love",
    setup: "cutepost",
    show_aliases: true,
    description: "so... cute",

    async execute(Message, Message_Args, Client) {
        const Chosen_Reddit = Reddits[Math.floor(Math.random() * Reddits.length)];
        const Random_Cute = await Get_Post(Chosen_Reddit);

        if (Random_Cute === null) Random_Cute = await Get_Post(Chosen_Reddit);

        Message.channel.send({embeds: [Post_Embed(Random_Cute, Chosen_Reddit)]});
    }
};