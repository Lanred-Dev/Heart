const fsAPI = require("fs");
const Session_Database = JSON.parse(fsAPI.readFileSync("web/Core/Databases/Session.json"));

function Get_Database_Session(ID) {
    if (!ID) return null;

    var Data = null;

    Session_Database.forEach(Gotten_Session => {
        if (Gotten_Session.session_id === ID || JSON.parse(Gotten_Session.data).id === ID) {
            Data = Gotten_Session;
        }
    });

    return Data;
}

function Update_Database_Session(Data, User_ID) {
    if (!Data || !User_ID) return;

    var Index = -1;

    Session_Database.forEach(Gotten_Session => {
        Index++;

        if (JSON.parse(Gotten_Session.data).id === User_ID) {
            Session_Database[Index] = Data;
        }
    });

    fsAPI.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Session_Database, null, 0));
}

module.exports = {
    name: "Serialize_Session",

    async execute(Request, User) {
        Request.session.user = User;
        Request.user = User;

        if (Get_Database_Session(User.id) === null) {
            Session_Database.push({
                session_id: Request.sessionID,
                expires_at: Request.session.cookie.expires,
                data: JSON.stringify(User)
            });
        } else {
            Update_Database_Session({
                session_id: Request.sessionID,
                expires_at: Request.session.cookie.expires,
                data: JSON.stringify(User)
            }, User.id);
        }

        fsAPI.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Session_Database, null, 0));
        return Get_Database_Session(Request.sessionID);
    }
};