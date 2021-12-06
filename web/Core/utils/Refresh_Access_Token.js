const fetch = require("node-fetch");
const fs = require("fs");
const Client_ID = process.env.CLIENT_ID;
const Client_Secert = process.env.CLIENT_SECRET;
const oauth_Database = Global_Databases.oauth;
const Encrypt_Tokens = require("./Encrypt_Tokens.js").execute;

function Update_Database_User(ID, Access_Token, Refresh_Token) {
    oauth_Database.forEach((Gotten_User, Index) => {
        if (Gotten_User.id === ID) {
            oauth_Database[Index].access = Access_Token;
            oauth_Database[Index].refresh = Refresh_Token;
        }
    });
}

module.exports = {
    name: "Refresh_Access_Token",

    async execute(ID, Refresh_Token) {
        const Response_Args = new URLSearchParams();
        Response_Args.append("client_id", Client_ID);
        Response_Args.append("client_secret", Client_Secert);
        Response_Args.append("grant_type", "refresh_token");
        Response_Args.append("refresh_token", Refresh_Token);

        const Response = await fetch(`https://discord.com/api/v9/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: Response_Args,
        });
        const JSON_Response = await Response.json();
        const Encrypted_Tokens = Encrypt_Tokens(JSON_Response.access_token, JSON_Response.refresh_token);

        Update_Database_User(ID, Encrypted_Tokens.Access_Token, Encrypted_Tokens.Refresh_Token);
        fs.writeFileSync("web/Core/Databases/oauth.json", JSON.stringify(oauth_Database, null, 0));

        return {
            Access_Token: JSON_Response.access_token,
            Refresh_Token: JSON_Response.refresh_token,
        }
    },
};
