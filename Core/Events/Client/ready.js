const Discord = require("discord.js");
const Get_Global_Member_Count = Global_Functions.Get_Global_Member_Count;
const Activities = [
    {
        Status: "{Server_Count}",
        Type: "WATCHING",
    },
    {
        Status: "love simulator ❤️",
        Type: "PLAYING",
    },
    {
        Status: "{Total_Member_Count}",
        Type: "WATCHING",
    },
];
global.Levels_Reach = [];

function Convert_Custom_Emojis(String) {
    const Pog_Replace = String.replace(/{Emoji_Pog}/g, "<:Pog:836464253215965185>");
    const Pepeohmygod_Replace = Pog_Replace.replace(/{Emoji_Pepeonmygod}/g, "<:2705_pepedealwithit:837127038527340575>");
    const Pepedealwithit_Replace = Pepeohmygod_Replace.replace(/{Emoji_Pepedealwithit}/g, "<:2705_pepedealwithit:837127040254738472>");
    const PepeSwat_Replace = Pepedealwithit_Replace.replace(/{Emoji_PepeSwat}/g, "<:9117_PepeSwat:837127039458213918>");
    const PepeLove_Replace = PepeSwat_Replace.replace(/{Emoji_PepeLove}/g, "<:9117_PepeLove:816092329718186024>");
    const Pepesadfriendhug_Replace = PepeLove_Replace.replace(/{Emoji_Pepesadfriendhug}/g, "<:3421_pepesadfriendhug:837463376548331560>");

    return Pepesadfriendhug_Replace.replace(/{Emoji_PepeThink}/g, "<:1404_PepeThink:816092329399943199>");
}

function Update_Embed(Info) {
    const Embed = new Discord.MessageEmbed().setTitle(":incoming_envelope: [Incoming Message] :incoming_envelope:").setDescription(`Another update has come to *Heart*!\n${Info}`).setColor("#FF2D00").setFooter("❤ Lanred & Tyler M-Wise");

    return Embed;
}

function Bot_Down_Embed(Info) {
    const Embed = new Discord.MessageEmbed().setTitle(":incoming_envelope: [Incoming Message] :incoming_envelope:").setDescription(Info).setColor("#FF2D00").setFooter("❤ Lanred & Tyler M-Wise");

    return Embed;
}

function New_Status(Current, Client) {
    const Member_Count = Get_Global_Member_Count(Client);
    const Type = Activities[Current].Type;
    const Status = Activities[Current].Status;
    const Member_Replace = Status.replace(/{Total_Member_Count}/g, Member_Count === 1 ? `${Member_Count} user` : `${Member_Count} users`);
    const Finial_Status = Member_Replace.replace(/{Server_Count}/g, Client.guilds.cache.size === 1 ? `${Client.guilds.cache.size} server` : `${Client.guilds.cache.size} servers`);

    Client.user.setPresence({
        activities: [
            {
                name: Finial_Status,
                type: Type != "" && Type ? Type : "PLAYING",
            },
        ],
    });
}

module.exports = async (Client) => {
    let Current_Status = 0;

    setInterval(() => {
        Current_Status > Activities.length - 2 ? (Current_Status = 0) : Current_Status++;

        New_Status(Current_Status, Client);
    }, 30000);

    console.log("Started.");
};
