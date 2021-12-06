const { SlashCommandBuilder } = require("@discordjs/builders");
const random_words = require("random-words");
const Embed = Global_Functions.Base_Embed;

module.exports = {
    info: new SlashCommandBuilder().setName("randomword").setDescription("There is so many words, the question is why?"),
    category: "fun",

    async execute(Interaction, Client) {
        const Words = random_words(30);
        const Word = Words[Math.floor(Math.random() * Words.length)];

        Interaction.reply({ embeds: [Embed(Word)] });
    },
};
