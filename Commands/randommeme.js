const Discord = require("discord.js");
const Just_Reddit = require("justreddit");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Reddits = ["meme", "NLSSCircleJerk", "memes", "MemeEconomy", "ComedyCemetery", "dankmemes"];
const Error_Embed = Global_Functions.Error_Embed;
const Base_Embed = Global_Functions.Base_Embed;

function Embed(Meme, Reddit) {
    const Embed = new Discord.MessageEmbed().setTitle(Meme.title).setImage(Meme.image).setColor(Global_Embed_Color).setURL(`https://reddit.com/r/${Reddit}`).setFooter(`❤ Posted by ${Meme.author} on r/${Reddit} • ${Meme.upvotes} upvotes`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("randommeme").setDescription("Will get ya a meme."),
    category: "meme",

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Base_Embed("Please wait...")] });

        try {
            const Reddit = Reddits[Math.floor(Math.random() * Reddits.length)];
            const Meme = await Just_Reddit.Post(Reddit, "top");

            if (Meme === null) return Interaction.editReply({ embeds: [Error_Embed("Failed to fetch meme.")] });

            Interaction.editReply({ embeds: [Embed(Meme, Reddit)] });
        } catch (Error) {
            console.log(`Failed to fetch meme.\nError: ${Error}`);

            Interaction.editReply({ embeds: [Error_Embed("Failed to fetch meme.")] });
        }
    },
};
