const ExpressAPI = require("express");
const httpAPI = require("http");
const Express_Session = require("express-session");
const pathAPI = require("path");
const fsAPI = require("fs");
const Body_Parser = require("body-parser");
const Cookie_ParserAPI = require("cookie-parser");
const App = ExpressAPI();
const Server = httpAPI.createServer(App);
const Get_Global_Member_Count = Global_Functions.Get_Global_Member_Count;
const Deserialize_Session = Global_Functions.web_utils.Deserialize_Session;
const Session_Secert = process.env.SESSION_SECERT;
const Latest_Announcement = {
    Message: "Heart Version 6 has been released! Check it out at 'heart.xyz/releases/latest'.",
    ID: "5936377294"
};

async function Get_Server_Count(Client) {
    return await Client.shard.fetchClientValues("guilds.cache.size")
        .then(Fetch_Response => {
            return Fetch_Response.reduce((Value_1, Value_2) => Value_1 + Value_2, 0);
        })
        .catch(Error => {
            console.log(`Failed to get guild count.\nError: ${Error}`);

            return 0;
        });
}

module.exports = (Client) => {
    App.set("view engine", "ejs");
    App.set("views", pathAPI.join(__dirname, "../views"));
    App.use(Body_Parser.urlencoded({extended: false}));
    App.use(Cookie_ParserAPI());
    App.use(ExpressAPI.static(pathAPI.join(__dirname, "../public")));
    App.use(Express_Session({
        secret: Session_Secert,
        name: "DISCORD_OAUTH",
        resave: false,
        saveUninitialized: false,
    }));
    App.use(Deserialize_Session);

    const Route_Files = fsAPI.readdirSync("./web/Core/Routes/").filter(File => File.endsWith(".js"));
    const Handler_Files = fsAPI.readdirSync("./web/Core/Handlers/").filter(File => File.endsWith(".js"));

    for (const File of Route_Files) {
        const Route = require(`../../web/Core/Routes/${File}`);

        if (Route.file != null && Route.file != "" && Route.path != null && Route.path != "") {
            App.get(Route.path, async (Request, Response) => {
                var Args = {};

                for await (const Argument of Route.args != null ? Route.args : []) {
                    if (Argument === "Latest_Announcement") {
                        if (Latest_Announcement === null || Latest_Announcement.Message === "" || Latest_Announcement.ID === "" || Latest_Announcement.ID === null) {
                            Args["Latest_Announcement"] = null;
                        } else {
                            Args["Latest_Announcement"] = Latest_Announcement;
                        }
                    } else if (Argument === "Server_Count") {
                        Args["Server_Count"] = await Get_Server_Count(Client).then(Count => {
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
                        if (Request.user != null) {
                            Args["User"] = JSON.stringify({
                                Username: Request.user?.username,
                                Tag: Request.user?.tag,
                                Icon: Request.user?.icon
                            });
                        } else {
                            Args["User"] = null;
                        }
                    }
                }

                if (Route.redirect != null && Route.redirect != "") {
                    Response.redirect(Route.redirect);
                } else if (Route.execute != null) {
                    Route.execute(Request, Response);
                } else {
                    Response.render(Route.file, Args);
                }
            });
        }
    };

    for (const File of Handler_Files) {
        require(`../../web/Core/Handlers/${File}`)(App, Client, Latest_Announcement);
    };

    Server.listen(3000 || 3001 || 3002 || 3003 || 3004, () => {
        console.log("Web-Server started.");
    });
};