const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Client_Intents = [];
const Requested_Client_Intents = process.env.INTENTS;
const Discord_Token = process.env.DISCORD_TOKEN;

Requested_Client_Intents.split(", ").forEach(Intent => {
    Intent = Intent.toUpperCase();

    if (DiscordAPI.Intents.FLAGS[Intent]) {
        Client_Intents.push(DiscordAPI.Intents.FLAGS[Intent]);
    }
});

const Client = new DiscordAPI.Client({
    intents: Client_Intents,
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true
    }
});
global.Global_Embed_Color = "#E81224";
global.Global_Functions = require("./Core/utils_Runner.js")();
global.Global_Databases = {
    Moderation: Global_Functions.Get_Database("Moderation"),
    Users: Global_Functions.Get_Database("Users"),
    Sessions: Global_Functions.Get_Database("Sessions"),
    oauth: Global_Functions.Get_Database("oauth")
};
Object.keys(Global_Databases).forEach((Key, Index) => {
    require("fs").watchFile([
        "Core/Databases/Moderation-Database.json",
        "Core/Databases/Users-Database.json",
        "web/Core/Databases/Session.json",
        "web/Core/Databases/oauth.json"
    ][Index], () => {
        Global_Databases[Key] = Global_Functions.Get_Database(Key);
    });
});
Global_Functions["web_utils"] = require("./web/Core/utils_Runner.js")();
Client.Commands = new DiscordAPI.Collection();
Client.Events = new DiscordAPI.Collection();

CanvasAPI.registerFont("./Core/Assets/Fonts/Regular.ttf", {
    family: "bsans-bold"
});

["Commands", "Events"].forEach(Event_Handler => {
    require(`./Core/${Event_Handler}`)(Client);
});

require(`./web/Core/Route_Runner.js`)(Client);
Client.login(Discord_Token);