const fsAPI = require("fs");
const Cookie_ParserAPI = require("cookie-parser");
const oauth_Database = Global_Databases.oauth;
const Sessions_Database = Global_Databases.Sessions;
const Session_Secert = process.env.SESSION_SECERT;

function Get_Database_Session(ID) {
    return Sessions_Database.find(Session => Session.session_id === ID);
}

module.exports = {
    name: "Deserialize_Session",

    async execute(Request, _, Next) {
        const {
            DISCORD_OAUTH
        } = Request.cookies;

        if (!DISCORD_OAUTH) return Next();

        const Session = Get_Database_Session(Cookie_ParserAPI.signedCookie(DISCORD_OAUTH, Session_Secert).toString());

        if (!Session) return Next();

        const Session_Index = Sessions_Database.indexOf(Session);

        if (Session.expires_at != null && Session.expires_at < new Date()) {
            delete Sessions_Database[Session_Index];
        } else {
            Request.user = oauth_Database.find(oauth => oauth.id === Session.data);
        }

        fsAPI.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Sessions_Database, null, 0));
        Next();
    }
};