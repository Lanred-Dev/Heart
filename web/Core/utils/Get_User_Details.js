const fetch = require("node-fetch");

module.exports = {
    name: "Get_User_Details",

    async execute(Access_Token) {
        const Response = await fetch("https://discord.com/api/v9/users/@me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Access_Token}`,
            },
        });
        let JSON_Response = await Response.json();
        JSON_Response.avatar = `https://cdn.discordapp.com/avatars/${JSON_Response.id}/${JSON_Response.avatar}.png`;

        return JSON_Response;
    },
};
