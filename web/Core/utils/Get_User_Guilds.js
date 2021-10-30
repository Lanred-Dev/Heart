const fetchAPI = require("node-fetch");
const Client_ID = process.env.CLIENT_ID;

module.exports = {
    name: "Get_User_Guilds",

    async execute(Access_Token, Client) {
        const Response = await fetchAPI("https://discord.com/api/v9/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Access_Token}`
            },
        });
        const JSON_Response = await Response.json();
        
        JSON_Response.forEach(Server => {
            const Guild = Client.guilds.cache.get(Server.id);

            Server.icon = `https://cdn.discordapp.com/icons/${Server.id}/${Server.icon}.png`;
            Server.bot_is_in = Guild?.members.cache.get(Client_ID);
            Server.member_count = Guild?.memberCount;
        });

        return JSON_Response;
    }
};