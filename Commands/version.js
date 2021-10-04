const DiscordAPI = require("discord.js");

function Update_Embed(Info) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":incoming_envelope: Version :incoming_envelope:")
        .setDescription(`${Info}`)
        .setColor(Global_Embed_Color)
        .setFooter("❤ Bot Version • Lanred & Tyler M-Wise");

    return Embed;
}

module.exports = {
    name: "version",
    aliases: ["botversion", "currentversion", "v"],
    category: "utility",
    setup: "version",
    show_aliases: true,
    description: "Will display the current bot version.",

    async execute(Message, Message_Args, Client) {        
        var Update_String = `\nUpdate Info for **${Update_Info.Version}**:\n`;
        var First_Note = true;

        Update_Info.Info.forEach(Note => {
            const Pog_Replace = Note.replace(/{Emoji_Pog}/g, "<:Pog:836464253215965185>");
            const Pepeohmygod_Replace = Pog_Replace.replace(/{Emoji_Pepeonmygod}/g, "<:2705_pepedealwithit:837127038527340575>");
            const Pepedealwithit_Replace = Pepeohmygod_Replace.replace(/{Emoji_Pepedealwithit}/g, "<:2705_pepedealwithit:837127040254738472>");
            const PepeSwat_Replace = Pepedealwithit_Replace.replace(/{Emoji_PepeSwat}/g, "<:9117_PepeSwat:837127039458213918>");
            const PepeLove_Replace = PepeSwat_Replace.replace(/{Emoji_PepeLove}/g, "<:9117_PepeLove:816092329718186024>");
            const Pepesadfriendhug_Replace = PepeLove_Replace.replace(/{Emoji_Pepesadfriendhug}/g, "<:3421_pepesadfriendhug:837463376548331560>");
            const Real_Note = Pepesadfriendhug_Replace.replace(/{Emoji_PepeThink}/g, "<:1404_PepeThink:816092329399943199>");

            if (First_Note) {
                Update_String = `${Update_String}\n${Real_Note}`, First_Note = false;
            } else {
                Update_String = `${Update_String}\n\n${Real_Note}`;
            };
        });

        Message.channel.send({embeds: [Update_Embed(Update_String)]});
    }
};