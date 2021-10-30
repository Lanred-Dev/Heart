require("dotenv").config();

const DiscordAPI = require("discord.js");
const Discord_Token = process.env.DISCORD_TOKEN;
const Manager = new DiscordAPI.ShardingManager("Bot_Runner.js", {
    token: Discord_Token
});

Manager.on("shardCreate", Shard => console.log(`Launched shard ${Shard.id}`));
Manager.spawn();