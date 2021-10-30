const fsAPI = require("fs");
const oauth_Database = Global_Databases.oauth;
const Sessions_Database = Global_Databases.Sessions;

function Get_Database_Session(ID) {
    return Sessions_Database.find(Session => Session.data === ID);
}

function Update_Database_Session(User_ID, Data) {
    if (!Data || !User_ID) return;

    Sessions_Database.forEach((_, Index) => {
        if (oauth_Database.find(User => User.id === User_ID) != null) {
            Sessions_Database[Index] = Data;
        }
    });
}

module.exports = {
    name: "Serialize_Session",

    async execute(Request, User) {
        Request.session.user = User;
        Request.user = User;

        if (!Get_Database_Session(User.id)) {
            Sessions_Database.push({
                session_id: Request.sessionID,
                expires_at: Request.session.cookie.expires,
                data: User.id
            });
        } else {
            Update_Database_Session(User.id, {
                session_id: Request.sessionID,
                expires_at: Request.session.cookie.expires,
                data: User.id
            });
        }

        fsAPI.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Sessions_Database, null, 0));
    }
};