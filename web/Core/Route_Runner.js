const ExpressAPI = require("express");
const httpAPI = require("http");
const Express_Session = require("express-session");
const pathAPI = require("path");
const fsAPI = require("fs");
const Cookie_ParserAPI = require("cookie-parser");
const App = ExpressAPI();
const Server = httpAPI.createServer(App);
const Get_Global_Member_Count = Global_Functions.Get_Global_Member_Count;
const Deserialize_Session = Global_Functions.web_utils.Deserialize_Session;
const Session_Secert = process.env.SESSION_SECERT;

module.exports = (Client, Lastest_Announcement) => {
    App.set("view engine", "ejs");
    App.set("views", pathAPI.join(__dirname, "../views"));
    App.use(Cookie_ParserAPI());
    App.use(ExpressAPI.static(pathAPI.join(__dirname, "../public")));
    App.use(Express_Session({
        secret: Session_Secert,
        name: "DISCORD_OAUTH",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 8.64e+7,
        }
    }));
    App.use(Deserialize_Session);

    const Route_Files = fsAPI.readdirSync("./web/Core/Routes/").filter(File => File.endsWith(".js"));
    const Handler_Files = fsAPI.readdirSync("./web/Core/Handlers/").filter(File => File.endsWith(".js"));

    for (const File of Route_Files) {
        const Route = require(`../../web/Core/Routes/${File}`);

        if (Route.file != null && Route.file != "" && Route.path != null && Route.path != "") {
            App.get(Route.path, (Request, Response) => {
                var Args = {};

                if (Route.args != null) {
                    Route.args.forEach(Argument => {
                        if (Argument === "Lastest_Announcement") {
                            Args["Lastest_Announcement"] = Lastest_Announcement;
                        } else if (Argument === "Server_Count") {
                            Args["Server_Count"] = Client.guilds.cache.size;
                        } else if (Argument === "Member_Count") {
                            Args["Member_Count"] = Get_Global_Member_Count(Client);
                        } else if (Argument === "User") {
                            if (!Request.user) {
                                Args["User"] = null;
                            } else if (Request.user != null) {
                                Args["User"] = JSON.stringify({
                                    Username: Request.user?.username,
                                    Tag: Request.user?.tag,
                                    Icon: Request.user?.icon
                                });
                            }
                        }
                    });
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
        require(`../../web/Core/Handlers/${File}`)(App);
    };

    Server.listen(3000 || 3001 || 3002 || 3003 || 3004, () => {
        console.log("Web-Server started.");
    });
};