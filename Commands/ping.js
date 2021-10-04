const DiscordAPI = require("discord.js");

function Ping_Embed(API_Latency) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("💬 [Server Sounds] 💬")
        .setColor(Global_Embed_Color)
        .addFields({
            name: "📶 API Latency 📶",
            value: `${API_Latency}ms`,
            inline: true
        });

    return Embed;
}

module.exports = {
    name: "ping",
    aliases: ["latency", "apiping"],
    category: "utility",
    setup: "ping",
    show_aliases: true,
    description: "Will list the API Latency of the bot.",

    async execute(Message, Message_Args, Client) {
        Message.channel.send({embeds: [Ping_Embed(Math.round(Client.ws.ping))]});
    }
};