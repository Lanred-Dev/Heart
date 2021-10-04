require("dotenv").config();

const DiscordAPI = require("discord.js");
const Client = new DiscordAPI.Client({
    intents: [DiscordAPI.Intents.FLAGS.GUILDS, DiscordAPI.Intents.FLAGS.GUILD_MESSAGES, DiscordAPI.Intents.FLAGS.GUILD_WEBHOOKS, DiscordAPI.Intents.FLAGS.GUILDS, DiscordAPI.Intents.FLAGS.GUILD_PRESENCES, DiscordAPI.Intents.FLAGS.GUILD_MESSAGES, DiscordAPI.Intents.FLAGS.GUILD_MEMBERS, DiscordAPI.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true
    }
});
const CanvasAPI = require("canvas");
const ExpressAPI = require("express");
const httpAPI = require("http");
const App = ExpressAPI();
const Server = httpAPI.createServer(App);
global.Global_Embed_Color = "#E81224";
global.Global_Functions = require(`./Core/utils_Runner.js`)();
Client.Commands = new DiscordAPI.Collection();
Client.Events = new DiscordAPI.Collection();

CanvasAPI.registerFont("Core/Assets/Fonts/Regular.ttf", {
    family: "bsans-bold"
});

["Commands", "Events"].forEach(Event_Handler => {
    require(`./Core/${Event_Handler}`)(Client);
});

App.set("view engine", "ejs");
App.set("views", `${__dirname}/web/views`);
App.use(ExpressAPI.static(`${__dirname}/web/public`));

App.get("/", (_, Reponse) => {
    var Member_Count = 0;

    Client.guilds.cache.forEach(Guild => {
        Member_Count += Guild.memberCount;
    });

    Reponse.render("index", {Server_Count: Client.guilds.cache.size, Member_Count: Member_Count, Lastest_Announcement: "Heart Version 6 has been released! Check it out at 'heart.xyz/releases/latest'."});
});

Server.listen(3000, () => {
    console.log("Server started.");
});

Client.login(process.env.DISCORD_TOKEN);