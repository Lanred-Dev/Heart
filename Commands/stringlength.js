const { SlashCommandBuilder } = require("@discordjs/builders");
const Embed = Global_Functions.Base_Embed;
const Error_Embed = Global_Functions.Error_Embed;

module.exports = {
    info: new SlashCommandBuilder()
        .setName("stringlength")
        .setDescription("Want to see how many characters a string is?")
        .addStringOption((Option) => Option.setName("string").setDescription("The string").setRequired(true)),
    category: "fun",

    async execute(Interaction, Client) {
        try {
            const String = Interaction.options.getString("string");

            Interaction.reply({ embeds: [Embed(`${Interaction.user.toString()}, ${String.length >= 1800 ? "the string" : String} is **${String.length + (String.length === 1 ? " character" : " characters")}** long.`)] });
        } catch (Error) {
            console.log(`Failed to convert string.\nError: ${Error}`);

            Interaction.reply({ embeds: [Error_Embed(Error)] });
        }
    },
};
