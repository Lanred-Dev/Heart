const fetchAPI = require("node-fetch");
const Redirect_URI = "http://localhost:3000/api/auth/callback";
const Client_ID = process.env.CLIENT_ID;
const Client_Secret = process.env.CLIENT_SECRET;

module.exports = {
    name: "Get_Access_Token",

    async execute(Code) {
        const Response_Args = new URLSearchParams();
        Response_Args.append("client_id", Client_ID);
        Response_Args.append("client_secret", Client_Secret);
        Response_Args.append("grant_type", "authorization_code");
        Response_Args.append("code", Code);
        Response_Args.append("redirect_uri", Redirect_URI);
        Response_Args.append("scope", "guilds%20identify");

        const Response = await fetchAPI("https://discord.com/api/v9/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${Code}`
            },
            body: Response_Args
        });

        return await Response.json();
    }
};