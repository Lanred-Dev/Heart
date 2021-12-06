const { SlashCommandBuilder } = require("@discordjs/builders");
const Narwhals = ["https://tenor.com/view/narwhal-ocean-arctic-whale-tusk-gif-3383412", "https://tenor.com/view/narwhal-evil-geno-turn-around-gif-15076424", "https://tenor.com/view/narwhal-gif-6033047", "https://tenor.com/view/elf-bye-buddy-christmas-gif-10601643"];

module.exports = {
    info: new SlashCommandBuilder().setName("narwhal").setDescription("hello mr. narwhal :wave:"),
    category: "fun",

    async execute(Interaction, Client) {
        Interaction.reply(Narwhals[Math.floor(Math.random() * Narwhals.length)]);
    },
};
