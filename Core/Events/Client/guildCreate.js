const Discord = require("discord.js");
const Channel_Names = ["general", "staffchat", "staff-chat", "bot-commands", "bots", "commands", "welcome", "log-channel", "logchannel", "welcome-channel", "english-general", "lounge", "chat", "main-chat", "mainchat", "general-chat", "generalchat", "welcome-messages", "welcomemessages", "staff", "staffchat", "staff-chat", "logs", "log-messages", "logmessages"];
const Guild_Constructor = require("../../../Core/utils/Data/Constructors/Guild.js");
const Moderation_Database = Global_Databases.Moderation;

function Edit_Distance(String_1, String_2) {
    String_1 = String_1.toLowerCase();
    String_2 = String_2.toLowerCase();

    let Costs = new Array();

    for (let Current_1 = 0; Current_1 <= String_1.length; Current_1++) {
        let Last_Value = Current_1;

        for (let Current_2 = 0; Current_2 <= String_2.length; Current_2++) {
            if (Current_1 == 0) Costs[Current_2] = Current_2;
            else {
                if (Current_2 > 0) {
                    let New_Value = Costs[Current_2 - 1];

                    if (String_1.charAt(Current_1 - 1) != String_2.charAt(Current_2 - 1)) New_Value = Math.min(Math.min(New_Value, Last_Value), Costs[Current_2]) + 1;

                    Costs[Current_2 - 1] = Last_Value;
                    Last_Value = New_Value;
                }
            }
        }
        if (Current_1 > 0) Costs[String_2.length] = Last_Value;
    }

    return Costs[String_2.length];
}

function String_Similarity(String_1, String_2) {
    let Longer = String_1;
    let Shorter = String_2;

    if (String_1.length < String_2.length) {
        Longer = String_2;
        Shorter = String_1;
    }

    const Longer_Length = Longer.length;

    if (Longer_Length == 0 || String_1 === String_2) {
        return 1.0;
    }

    return (Longer_Length - Edit_Distance(Longer, Shorter)) / parseFloat(Longer_Length);
}

function Join_Embed(Guild) {
    const Embed = new Discord.MessageEmbed().setTitle("Hello :wave:").setDescription(`Thanks for adding Heart to **${Guild}**!\n\nIf you need any help just do **/help** (or @Heart#0262 help) or you can check out our [website](https://heart.xyz).\n\nWhat are some things you can do to start setting up Heart?\n• `).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = async (Guild) => {
    try {
        if (!Moderation_Database[Guild.id]) Moderation_Database[Guild.id] = Guild_Constructor;

        let Welcome_Message_Channel = null;

        Channel_Names.forEach((Channel_Name) => {
            Guild.channels.cache
                .filter((Channel) => Channel.deleted === false && Channel.type === "GUILD_TEXT")
                .forEach((Channel) => {
                    if (String_Similarity(Channel.name.toLowerCase(), Channel_Name) >= 0.75) {
                        return (Welcome_Message_Channel = Channel);
                    }
                });
        });
        c
        if (!Welcome_Message_Channel) return;

        Welcome_Message_Channel.send({ embeds: [Join_Embed(Guild.name)] });
    } catch (Error) {
        console.log(`Failed to send message on guild create.\nError: ${Error}`);
    }
};
