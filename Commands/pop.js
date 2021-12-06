const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Tip = Global_Functions.Get_Tip;
const Embed = Global_Functions.Base_Embed;
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Pops = ["pop", "bigger pop", "big big big big big big big big pop", "just pop", "heart best popper ever"];

function Get_Row(Word, Size) {
    let String = "";

    for (let Current = 0; Current < Size; Current++) {
        String = `${String}||${Word}||`;
    }

    return String;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("pop")
        .setDescription("pop is like pop")
        .addStringOption((Option) => Option.setName("pop").setDescription("The pop string").setRequired(false)),
    category: "fun",

    async execute(Interaction, Client) {
        const Word = Interaction.options.getString("pop") || Pops[Math.floor(Math.random() * Pops.length)];
        
        if (Word.length > 50) return Message.channel.send({ embeds: Ambulance_Embed(`${Message.author.toString()}, the word must be less than 20 characters.`) });

        let String = null;

        for (let Current = 0; Current < 5; Current++) {
            String = String ? `${String}\n${Get_Row(Word, 6)}` : Get_Row(Word, 6);
        }

        Interaction.reply({content: Get_Tip(), embeds: [Embed(String)]});
    },
};
