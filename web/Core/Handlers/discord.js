const fs = require("fs");
const fetch = require("node-fetch");
const Get_Access_Token = Global_Functions.web_utils.Get_Access_Token;
const Get_User_Details = Global_Functions.web_utils.Get_User_Details;
const Get_Database_User = Global_Functions.web_utils.Get_oauth_Database_User;
const Encrypt_Tokens = Global_Functions.web_utils.Encrypt_Tokens;
const Sessions_Database = Global_Databases.Sessions;
const oauth_Database = Global_Databases.oauth;
const Client_ID = process.env.CLIENT_ID;
const Client_Secret = process.env.CLIENT_SECRET;
const catchAsyncErrors = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};

function Update_Database_User(ID, Data) {
    oauth_Database.forEach((Gotten_User, Index) => {
        if (Gotten_User.id === ID) {
            oauth_Database[Index] = Data;
        }
    });
}

function Update_Database_Session(ID, Data) {
    Sessions_Database.forEach((_, Index) => {
        if (oauth_Database.find((User) => User.id === ID)) {
            Sessions_Database[Index] = Data;
        }
    });
}

function Get_Database_Session(ID) {
    return Sessions_Database.find((Session) => Session.data === ID);
}

function Serialize_Session(Request, User) {
    Request.session.user = User;
    Request.user = User;

    if (!Get_Database_Session(User.id)) {
        Sessions_Database.push({
            session_id: Request.sessionID,
            data: User.id,
        });
    } else {
        Update_Database_Session(User.id, {
            session_id: Request.sessionID,
            data: User.id,
        });
    }

    fs.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Sessions_Database, null, 0));
}

module.exports = async (App) => {
    App.get(
        "/api/auth/callback",
        catchAsyncErrors(async (Request, Response) => {
            try {
                const Code = Request.query.code;

                if (!Code) return Response.redirect("/errors/auth_failure");

                const Access_Token = await Get_Access_Token(Code);
                const User = await Get_User_Details(Access_Token.access_token);

                if (!User || !User.id) return Response.redirect("/errors/401");

                const Encrypted_Tokens = Encrypt_Tokens(Access_Token.access_token, Access_Token.refresh_token);

                if (!Get_Database_User(User.id)) {
                    oauth_Database.push({
                        id: User.id,
                        username: User.username,
                        icon: User.avatar,
                        tag: User.discriminator,
                        expires_at: new Date(new Date() + 10080 * 60000).getTime(),
                        access: Encrypted_Tokens.Access_Token,
                        refresh: Encrypted_Tokens.Refresh_Token,
                    });
                } else {
                    Update_Database_User(User.id, {
                        id: User.id,
                        username: User.username,
                        icon: User.avatar,
                        tag: User.discriminator,
                        expires_at: new Date(new Date() + 10080 * 60000).getTime(),
                        access: Encrypted_Tokens.Access_Token,
                        refresh: Encrypted_Tokens.Refresh_Token,
                    });
                }

                const Database_User = Get_Database_User(User.id);

                fs.writeFileSync("web/Core/Databases/oauth.json", JSON.stringify(oauth_Database, null, 0));
                Serialize_Session(Request, Database_User);
                Response.render("api/callback", {
                    Username: Database_User.username,
                });
            } catch (Error) {
                console.log(`Failed to login.\nError: ${Error}`);
                Response.redirect("/errors/auth_failure");
            }
        })
    );

    App.get(
        "/logout",
        catchAsyncErrors(async (Request, Response) => {
            if (!Request.user) return Response.redirect("/errors/401");

            try {
                const Response_Args = new URLSearchParams();
                Response_Args.append("client_id", Client_ID);
                Response_Args.append("client_secret", Client_Secret);
                Response_Args.append("grant_type", "authorization_code");
                Response_Args.append("token", Request.user.access);

                await fetch("https://discord.com/api/v9/oauth2/revoke", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: Response_Args,
                });

				Request.session.destroy();
            } catch (Error) {
                console.log(`Failed to logout.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );
};
