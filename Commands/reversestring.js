const { SlashCommandBuilder } = require("@discordjs/builders");
const Embed = Global_Functions.Base_Embed;

module.exports = {
    info: new SlashCommandBuilder()
        .setName("reversestring")
        .setDescription("gnirts a gnisrever rof dnammoc ynnuf a si siht")
        .addStringOption((Option) => Option.setName("string").setDescription("The string").setRequired(true)),
    category: "fun",

    async execute(Interaction, Client) {
        const String = Interaction.options.getString("string");

        Interaction.reply({embeds: [Embed(`${Interaction.user.toString()}, ${String >= 1800 ? "the string" : String} reversed is **${String.split("").reverse().join("")}**.`)]});
    },
};
