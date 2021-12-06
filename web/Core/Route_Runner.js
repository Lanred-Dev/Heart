const Express = require("express");
const http = require("http");
const socket_io = require("socket.io");
const Express_Session = require("express-session");
const path = require("path");
const fs = require("fs");
const Body_Parser = require("body-parser");
const Cookie_Parser = require("cookie-parser");
const Cookie = require("cookie");
const App = Express();
const Server = http.createServer(App);
const Get_Global_Member_Count = Global_Functions.Get_Global_Member_Count;
const Get_oauth_Database_User = Global_Functions.web_utils.Get_oauth_Database_User;
const Refresh_Access_Token = Global_Functions.web_utils.Refresh_Access_Token;
const Session_Secert = process.env.SESSION_SECERT;
const Sessions_Database = Global_Databases.Sessions;
const Decrypt_Tokens = Global_Functions.web_utils.Decrypt_Tokens;
const Latest_Announcement = require("../../Core/utils/Data/Announcement.json");
const Socket_Wrap = (Middleware) => (Socket, Next) => Middleware(Socket.request, {}, Next);

function Get_Database_Session(ID) {
    return Sessions_Database.find((Session) => Session.session_id === ID);
}

async function Get_Server_Count(Client) {
    return await Client.shard
        .fetchClientValues("guilds.cache.size")
        .then((Fetch_Response) => {
            return Fetch_Response.reduce((Value_1, Value_2) => Value_1 + Value_2, 0);
        })
        .catch((Error) => {
            console.log(`Failed to get guild count.\nError: ${Error}`);

            return 0;
        });
}

async function Deserialize_Session(Request, _, Next) {
    const { DISCORD_OAUTH } = Request.cookies ? Request.cookies : Cookie.parse(Request.headers.cookie);

    if (!DISCORD_OAUTH) return Next();

    const Session = Get_Database_Session(Cookie_Parser.signedCookie(DISCORD_OAUTH, Session_Secert).toString());

    if (!Session) return Next();

    const Session_Index = Sessions_Database.indexOf(Session);

    if (Session.expires_at && Session.expires_at < new Date().getTime()) {
        delete Sessions_Database[Session_Index];
    } else {        
        const User = Get_oauth_Database_User(Session.data);
        let Decrypted_Tokens = User ? Decrypt_Tokens(User.access, User.refresh) : null;

        if (Decrypted_Tokens && User.expires_at < new Date().getTime()) {
            const New_Tokens = await Refresh_Access_Token(Session.data, Decrypted_Tokens.Refresh_Token)
            Decrypted_Tokens = {Access_Token: New_Tokens.Access_Token, Refresh_Token: New_Tokens.Refresh_Token};
        }

        if (Decrypted_Tokens) {
            User.access = Decrypted_Tokens.Access_Token;
            User.refresh = Decrypted_Tokens.Refresh_Token;
        }

        Request.user = User;
    }

    fs.writeFileSync("web/Core/Databases/Session.json", JSON.stringify(Sessions_Database, null, 0));
    Next();
}

module.exports = (Client) => {
    App.set("view engine", "ejs");
    App.set("views", path.join(__dirname, "../views"));
    App.use(Body_Parser.urlencoded({ extended: false }));
    App.use(Cookie_Parser());
    App.use(Express.static(path.join(__dirname, "../public")));
    App.use(
        Express_Session({
            secret: Session_Secert,
            name: "DISCORD_OAUTH",
            resave: false,
            saveUninitialized: false,
        })
    );
    App.use(Deserialize_Session);

    const Socket_Server = socket_io(Server, {
        cors: {
            origin: "/",
            methods: ["GET", "POST"],
        },
    });

    Socket_Server.use(
        Socket_Wrap(
            Express_Session({
                secret: Session_Secert,
                name: "DISCORD_OAUTH",
                resave: false,
                saveUninitialized: false,
            })
        )
    );
    Socket_Server.use(Socket_Wrap(Deserialize_Session));

    const Route_Files = fs.readdirSync("./web/Core/Routes/").filter((File) => File.endsWith(".js"));
    const Handler_Files = fs.readdirSync("./web/Core/Handlers/").filter((File) => File.endsWith(".js"));

    for (const File of Route_Files) {
        const Route = require(`../../web/Core/Routes/${File}`);

        if (Route.file && Route.file != "" && Route.path && Route.path != "") {
            App.get(Route.path, async (Request, Response) => {
                let Args = {};

                for await (const Argument of Route.args ? Route.args : []) {
                    if (Argument === "Latest_Announcement") {
                        if (Latest_Announcement === null || Latest_Announcement.Message === "" || Latest_Announcement.ID === "" || Latest_Announcement.ID === null) {
                            Args["Latest_Announcement"] = null;
                        } else {
                            Args["Latest_Announcement"] = Latest_Announcement;
                        }
                    } else if (Argument === "Server_Count") {
                        Args["Server_Count"] = await Get_Server_Count(Client).then((Count) => {
                            return Count;
                        });

                        if (Args["Server_Count"] === 0 || Args["Server_Count"] === null || Args["Server_Count"] === "") {
                            Args["Server_Count"] = "NA";
                        }
                    } else if (Argument === "Member_Count") {
                        Args["Member_Count"] = Get_Global_Member_Count(Client);

                        if (Args["Member_Count"] === 0) {
                            Args["Member_Count"] = "NA";
                        }
                    } else if (Argument === "User") {
                        if (Request.user) {
                            Args["User"] = JSON.stringify({
                                Username: Request.user?.username,
                                Tag: Request.user?.tag,
                                Icon: Request.user?.icon,
                            });
                        } else {
                            Args["User"] = null;
                        }
                    }
                }

                if (Route.redirect && Route.redirect != "") {
                    Response.redirect(Route.redirect);
                } else if (Route.execute) {
                    Route.execute(Request, Response);
                } else {
                    Response.render(Route.file, Args);
                }
            });
        }
    }

    for (const File of Handler_Files) {
        require(`../../web/Core/Handlers/${File}`)(App, Client, Socket_Server);
    }

    Server.listen(3000, () => {
        console.log("Web-Server started.");
    });

    Socket_Server.listen(4000);
};
