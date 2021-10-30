const DiscordAPI = require("discord.js");
const Channel_Names = [
    "general",
    "staffchat",
    "staff-chat",
    "bot-commands",
    "bots",
    "commands",
    "welcome",
    "log-channel",
    "logchannel",
    "welcome-channel",
    "english-general",
    "lounge",
    "chat",
    "main-chat",
    "mainchat",
    "general-chat",
    "generalchat",
    "welcome-messages",
    "welcomemessages",
    "staff",
    "staffchat",
    "staff-chat",
    "logs",
    "log-messages",
    "logmessages"
];
const Prefix = process.env.PREFIX;

function Edit_Distance(String_1, String_2) {
    String_1 = String_1.toLowerCase();
    String_2 = String_2.toLowerCase();

    var Costs = new Array();

    for (var Current_1 = 0; Current_1 <= String_1.length; Current_1++) {
        var Last_Value = Current_1;

        for (var Current_2 = 0; Current_2 <= String_2.length; Current_2++) {
            if (Current_1 == 0)
                Costs[Current_2] = Current_2;
            else {
                if (Current_2 > 0) {
                    var New_Value = Costs[Current_2 - 1];
                    
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
    var Longer = String_1;
    var Shorter = String_2;

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
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("Hello :wave:")
        .setDescription(`Thanks for adding Heart to **${Guild}**!\n\nIf you need any help just do **${Prefix}help** or you can check out our [website](https://heart.xyz).\n\nWhat are some things you can do to start setting up Heart?\n• Set a log channel **${Prefix}logchannel [Channel Name]**`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = async (Guild) => {
    if (!Moderation_Database[Message.guild.id]) Moderation_Database[Message.guild.id] = {
        log_channel: null,
        warns: {},
        appeal_statement: "None",
        bot_updates: {
            enabled: false,
            channel: null
        },
        currency_system: false,
        level_system: {
            enabled: false,
            multiplier: 1
        },
        disabled_commands: [],
        welcome: {
            message: null,
            channel: null,
            embed: null,
            thumbnail: null,
            icon: null,
            footer: null,
            color: null,
            title: null,
        },
        leave: {
            message: null,
            channel: null,
            embed: null,
            thumbnail: null,
            icon: null,
            footer: null,
            color: null,
            title: null,
        }
    };

    var Welcome_Message_Channel = null;

    for (var Current = 0; Current < Channel_Names.length; Current++) {
        Guild.channels.cache.forEach(Gotten_Channel => {
            if (Gotten_Channel.deleted != true) {                
                if (String_Similarity(Gotten_Channel.name.toLowerCase(), Channel_Names[Current]) >= 0.75) {
                    return Welcome_Message_Channel = Gotten_Channel;
                }
            }
        });
    }

    if (!Welcome_Message_Channel) return;

    Welcome_Message_Channel.send({embeds: [Join_Embed(Channel.guild.name)]}).catch();
};