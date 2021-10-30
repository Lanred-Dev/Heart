const fsAPI = require("fs");
const Get_Access_Token = Global_Functions.web_utils.Get_Access_Token;
const Get_User_Details = Global_Functions.web_utils.Get_User_Details;
const Serialize_Session = Global_Functions.web_utils.Serialize_Session;
const Get_Database_User = Global_Functions.web_utils.Get_oauth_Database_User;
const oauth_Database = Global_Databases.oauth;
const catchAsyncErrors = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

function Update_Database_User(Session_ID, Data) {
    if (!Session_ID || !Data) return;

    oauth_Database.forEach((Gotten_User, Index) => {
        Index++;

        if (Gotten_User.id === Session_ID) {
            oauth_Database[Index] = Data;
        }
    });
}

module.exports = async (App) => {
    App.get("/api/auth/callback", catchAsyncErrors(async (Request, Response) => {
        const Code = Request.query.code;

        if (!Code) return;

        try {
            const Access_Token = await Get_Access_Token(Code);
            const User = await Get_User_Details(Access_Token.access_token);

            if (!User.id) return Response.sendStatus(401);

            if (!Get_Database_User(User.id)) {
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

            fsAPI.writeFileSync("web/Core/Databases/oauth.json", JSON.stringify(oauth_Database, null, 0));
            Serialize_Session(Request, Get_Database_User(User.id));
            Response.render("api/callback", {
                Username: Get_Database_User(User.id).username
            });
        } catch (Error) {
            console.log(`Failed to login.\nError: ${Error}`);
            Response.redirect("/errors/500");
        };
    }));

    App.get("/api/auth/user", catchAsyncErrors(async (Request, Response) => {
        return Request.user != null ? Response.send(Request.user) : Response.sendStatus(401);
    }));

    App.get("/logout", catchAsyncErrors(async (Request, Response) => {
        return Request.user != null ? Response.send(Request.user) : Response.sendStatus(401);
    }));
};