const fsAPI = require("fs");
const Cookie_ParserAPI = require("cookie-parser");
const Session_Database = JSON.parse(fsAPI.readFileSync("web/Core/Databases/Session.json"));
const Session_Secert = process.env.SESSION_SECERT;

function Get_Database_Session(Session_ID) {
    if (!Session_ID) return null;

    var Data = null;
    var Index = -1;

    Session_Database.forEach(Gotten_Session => {
        Index++;

        if (Gotten_Session.session_id === Session_ID) {
            Data = {Data: Gotten_Session, Index: Index};
        }
    });

    return Data;
}

module.exports = {
    name: "Deserialize_Session",

    async execute(Request, _, Next) {
        const {DISCORD_OAUTH} = Request.cookies;

        if (!DISCORD_OAUTH) return Next();

        const Session_Id = Cookie_ParserAPI.signedCookie(DISCORD_OAUTH, Session_Secert).toString();
        const Session = Get_Database_Session(Session_Id);

        if (!Session) return Next();

        const Current_Time = new Date();

        if (Session.Data.expires_at < Current_Time) {
            delete Session_Database[Session.Index];
        } else {
            Request.user = JSON.parse(Session.Data.data);
        }

        fsAPI.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Session_Database, null, 0));
        Next();
    }
};