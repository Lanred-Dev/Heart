const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Pepes = {
    moab:[ "https://www.pinterest.com/pin/205687907969035088/", "no no this is to dangerous for you"],
    hacker: ["https://www.pinterest.com/pin/745205069586337565/", "HACK THE MAIN FRAME!!!"],
    plankton: ["https://www.pinterest.com/pin/50524827049916337/", "i never got the formula"],
    luminati: ["https://www.pinterest.com/pin/811281320361068916/", "ITS THE SPACE ALIENS!"],
    pepsi: ["https://www.pinterest.com/pin/737957088921743708/", "worst drink ever"],
    hehe: ["https://www.pinterest.com/pin/748582769302238059/", "hehe"],
    you: ["https://www.pinterest.com/pin/921760248703857345/", "you rn"],
    buff: ["https://www.pinterest.com/pin/679902874979402084/", "what you could be rn"] //download all these images
};

function Embed(Status, Image) {
    const Embed = new Discord.MessageEmbed().setDescription(Status).setImage(Image).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("pepe")
        .setDescription("Pepe! yk what I mean?")
        .addStringOption((Option) =>
            Option.setName("pepe")
                .setDescription("the pepe")
                .setRequired(false)
                .addChoices([
                    ["moab", "moab"],
                    ["hacker", "hacker"],
                    ["plankton", "plankton"],
                    ["luminati", "luminati"],
                    ["pepsi", "pepsi"],
                    ["hehe", "hehe"],
                    ["you", "you"],
                    ["buff", "buff"]
                ])
        ),
    category: "fun",

    async execute(Interaction, Client) {
        const Pepe = Interaction.options.getString("pepe") ? Pepes[Interaction.options.getString("pepe")] : Pepes[Math.floor(Math.random() * Pepes.length)];

        Interaction.reply({ embeds: [Embed(Pepe[1], Pepe[0])] });
    },
};
