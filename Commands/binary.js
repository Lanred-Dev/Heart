const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Error_Embed = Global_Functions.Error_Embed;
const Embed = Global_Functions.Base_Embed;

module.exports = {
    info: new SlashCommandBuilder()
        .setName("binary")
        .setDescription("Takes the provided string and converts it to binary!")
        .addStringOption((Option) => Option.setName("string").setDescription("The string").setRequired(true)),
    category: "fun",

    async execute(Interaction, Client) {
        try {
            const String = Interaction.options.getString("string");

            if (String.length > 100) return Interaction.reply({embeds: [Embed(`${Interaction.user.toString()}, the conversion can be found [here](http://localhost:3000/features/binary?string=${String}).`)]});

            const Converted = String.split("")
                .map(Character => Character.charCodeAt(0).toString(2))
                .join(" ");

            Interaction.reply({embeds: [Embed(`${Interaction.user.toString()}, ${String.length > 50 ? "the string" : String} in binary is **${Converted}**.`)]});
        } catch (Error) {
            console.log(`Failed to convert string to binary.\nError: ${Error}`);

            Interaction.reply({embeds: [Error_Embed(Error)]});
        }
    },
};
