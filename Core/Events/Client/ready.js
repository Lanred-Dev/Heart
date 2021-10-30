const DiscordAPI = require("discord.js");
const fsAPI = require("fs");
const Prefix = process.env.PREFIX;
const Get_Global_Member_Count = Global_Functions.Get_Global_Member_Count;
const Activities = [{
    Status: "{Server_Count}",
    Type: "WATCHING"
}, {
    Status: "love simulator ❤️",
    Type: "PLAYING"
}, {
    Status: `for ${Prefix}`,
    Type: "WATCHING"
}, {
    Status: "{Total_Member_Count}",
    Type: "WATCHING"
}];
global.Update_Info = {
    Should_Send: false,
    Version: "Version 6",
    Info: [
        "• `.clear` and `.logchannel` bug fixes.",
        "See you in the next update, gamers, {Emoji_PepeLove}{Emoji_Pepesadfriendhug}",
    ]
};
const Bot_Down = false;
global.Levels_Reach = [];
global.Moderation_Database = JSON.parse(fsAPI.readFileSync("Core/Databases/Moderation-Database.json")),
global.Users_Database = JSON.parse(fsAPI.readFileSync("Core/Databases/Users-Database.json")),
global.Commands_Info = {
    Cooldowns: {},
    Role_Permissions: {}
}

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
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":incoming_envelope: [Incoming Message] :incoming_envelope:")
        .setDescription(`Another update has come to *Heart*!\n${Info}`)
        .setColor("#FF2D00")
        .setFooter("❤ Lanred & Tyler M-Wise");

    return Embed;
}

function Bot_Down_Embed(Info) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":incoming_envelope: [Incoming Message] :incoming_envelope:")
        .setDescription(Info)
        .setColor("#FF2D00")
        .setFooter("❤ Lanred & Tyler M-Wise");

    return Embed;
}

function New_Status(Current, Client) {
    const Member_Count = Get_Global_Member_Count(Client);
    const Type = Activities[Current].Type;
    const Status = Activities[Current].Status;
    const Member_Replace = Status.replace(/{Total_Member_Count}/g, Member_Count === 1 ? `${Member_Count} user` : `${Member_Count} users`);
    const Finial_Status = Member_Replace.replace(/{Server_Count}/g, Client.guilds.cache.size === 1 ? `${Client.guilds.cache.size} server` : `${Client.guilds.cache.size} servers`);

    Client.user.setPresence({
        activities: [{
            name: Finial_Status,
            type: Type != "" && Type != null ? Type : "PLAYING"
        }],
    });
}

module.exports = async (Client) => {
    console.log("Started.");

    var Current_Status = 0;

    Client.Commands.forEach(File => {
        if (File.cooldown && File.cooldown > 0) {
            Commands_Info.Cooldowns[File.name] = new Set();
        }

        if (File.permissions) {
            Commands_Info.Role_Permissions[File.name] = File.permissions;
        }
    });

    for (var Current = 0; 500 > Current; Current++) {
        Levels_Reach[Current] = 50 * Current;
    };

    if (Update_Info.Should_Send && !Bot_Down) {
        Client.guilds.cache.forEach(Guild => {
            if (!Moderation_Database.Bot_Updates[Guild.id]) Moderation_Database.Bot_Updates[Guild.id] = {
                receive: false,
                channel: null
            }, fsAPI.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 2));

            const Channel = Moderation_Database.Bot_Updates[Guild.id].channel;

            if (Channel && Moderation_Database.Bot_Updates[Guild.id].receive === true) {
                const Real_Channel = Guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Channel.toLowerCase();
                });

                if (!Real_Channel) return;

                var Update_String = `\nUpdate Info for **${Update_Info.Version}**:\n`;
                var First_Note = true;

                Update_Info.Info.forEach(Note => {
                    const Real_Note = Convert_Custom_Emojis(Note);

                    if (First_Note) {
                        Update_String = `${Update_String}\n${Real_Note}`, First_Note = false;
                    } else {
                        Update_String = `${Update_String}\n\n${Real_Note}`;
                    };
                });

                Real_Channel.send(Update_Embed(Update_String));
            };
        });
    } else if (Bot_Down) {
        Client.guilds.cache.forEach(Guild => {
            if (!Moderation_Database.Bot_Updates[Guild.id]) Moderation_Database.Bot_Updates[Guild.id] = {
                receive: false,
                channel: null
            }, fsAPI.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 2));

            const Channel = Moderation_Database.Bot_Updates[Guild.id].channel;

            if (Channel && Moderation_Database.Bot_Updates[Guild.id].receive === true) {
                const Real_Channel = Guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Channel.toLowerCase();
                });

                if (!Real_Channel) return;

                const Message = "I am going to have some downtime! {Emoji_Pepesadfriendhug} Its okay I will be back up soon.\n\n**Reason for downtime: Version 6 Testing. Bot may be down for 1+ hours.**";
                const Real_Message = Convert_Custom_Emojis(Message);

                Real_Channel.send(Bot_Down_Embed(Real_Message));
            };
        });
    };

    New_Status(Current_Status, Client);

    setInterval(() => {
        Current_Status > Activities.length - 2 ? Current_Status = 0 : Current_Status++;

        New_Status(Current_Status, Client);
    }, 30000);
};