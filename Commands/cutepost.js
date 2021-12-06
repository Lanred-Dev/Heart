const Discord = require("discord.js");
const Just_Reddit = require("justreddit");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Error_Embed = Global_Functions.Error_Embed;
const Base_Embed = Global_Functions.Base_Embed;
const Reddits = ["aww"];

function Embed(Cute_Post, Reddit) {
    const Embed = new Discord.MessageEmbed().setTitle(Cute_Post.title).setImage(Cute_Post.image).setColor(Global_Embed_Color).setURL(`https://reddit.com/r/${Reddit}`).setFooter(`❤ Posted by ${Cute_Post.author} on r/${Reddit} • ${Cute_Post.upvotes} upvotes`);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder().setName("cutepost").setDescription("so... cute"),
    category: "love",

    async execute(Interaction, Client) {
        Interaction.reply({ embeds: [Base_Embed("Please wait...")] });

        try {
            const Reddit = Reddits[Math.floor(Math.random() * Reddits.length)];
            const Cute_Post = await Just_Reddit.Post(Reddit, "top");

            if (Cute_Post === null) return Interaction.editReply({ embeds: [Error_Embed("Failed to fetch cute post.")] });

            Interaction.editReply({ embeds: [Embed(Cute_Post, Reddit)] });
        } catch (Error) {
            console.log(`Failed to fetch cutepost.\nError: ${Error}`);

            Interaction.editReply({ embeds: [Error_Embed("Failed to fetch cute post.")] });
        }
    },
};
