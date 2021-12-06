const fetch = require("node-fetch");
const Client_ID = process.env.CLIENT_ID;

module.exports = {
    name: "Get_User_Guilds",

    async execute(Access_Token, Client) {
        const Response = await fetch("https://discord.com/api/v9/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Access_Token}`,
            },
        });
        const JSON_Response = await Response.json();

        if (JSON_Response.message) return [];

        const Servers_Is_In = [];
        const Servers = [];

        JSON_Response.forEach((Server) => {
            const Guild = Client.guilds.cache.get(Server.id);
            const Is_In = Guild?.members.cache.get(Client_ID);

            Server.icon = Server.icon ? `https://cdn.discordapp.com/icons/${Server.id}/${Server.icon}.png` : null;
            Server.bot_is_in = Is_In;
            Server.member_count = Guild?.memberCount;

            if (Is_In) {
                Servers_Is_In.push(Server);
            } else {
                Servers.push(Server);
            }
        });

        return Servers_Is_In.concat(Servers);
    },
};
