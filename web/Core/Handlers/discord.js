const fsAPI = require("fs");
const Get_Access_Token = Global_Functions.web_utils.Get_Access_Token;
const Get_User_Details = Global_Functions.web_utils.Get_User_Details;
const Serialize_Session = Global_Functions.web_utils.Serialize_Session;
const oauth_Database = JSON.parse(fsAPI.readFileSync("web/Core/Databases/oauth.json"));
const catchAsyncErrors = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

function Get_Database_User(Session_ID) {
    if (!Session_ID) return null;

    var User = null;

    oauth_Database.forEach(Gotten_User => {
        if (Gotten_User.id === Session_ID.toString()) {
            User = Gotten_User;
        }
    });

    return User;
}

function Update_Database_User(Session_ID, Data) {
    if (!Session_ID) return;

    var Index = -1;

    oauth_Database.forEach(Gotten_User => {
        Index++;

        if (Gotten_User.id === Session_ID) {
            oauth_Database[Index] = Data;
        }
    });

    fsAPI.writeFileSync("web/Core/Databases/oauth.json", JSON.stringify(oauth_Database, null, 0));
}

module.exports = async (App) => {
    App.get("/api/auth/callback", catchAsyncErrors(async (Request, Response) => {
        const Code = Request.query.code;

        if (!Code) return;

        try {
            const Access_Token = await Get_Access_Token(Code);
            const User = await Get_User_Details(Access_Token.access_token);

            if (!User.id) return Response.sendStatus(401);

            if (Get_Database_User(User.id) === null) {
                oauth_Database.push({
                    id: User.id,
                    username: User.username,
                    icon: User.avatar,
                    tag: User.discriminator,
                    access: Access_Token.access_token,
                    refresh: Access_Token.refresh_token,
                });
            } else {
                Update_Database_User(User.id, {
                    id: User.id,
                    username: User.username,
                    icon: User.avatar,
                    tag: User.discriminator,
                    access: Access_Token.access_token,
                    refresh: Access_Token.refresh_token,
                });
            }

            await Serialize_Session(Request, Get_Database_User(User.id));

            Response.render("api/callback", {Username: Get_Database_User(User.id).username});
            fsAPI.writeFileSync("web/Core/Databases/oauth.json", JSON.stringify(oauth_Database, null, 0));
        } catch (Error) {
            console.log(`Failed to login.\nError: ${Error}`);
        }
    }));

    App.get("/api/auth/user", catchAsyncErrors(async (Request, Response) => {
        return Request.user != null ? Response.send(Request.user) : Response.sendStatus(401);
    }));

    App.get("/api/auth/revoke", catchAsyncErrors(async (Request, Response) => {
        return Request.user != null ? Response.send(Request.user) : Response.sendStatus(401);
    }));
};