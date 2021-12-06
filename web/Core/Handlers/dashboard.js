const Get_Database_User = Global_Functions.web_utils.Get_oauth_Database_User;
const Get_User_Guilds = Global_Functions.web_utils.Get_User_Guilds;
const Decrypt_Tokens = Global_Functions.web_utils.Decrypt_Tokens;
const catchAsyncErrors = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};
const Latest_Announcement = require("../../../Core/utils/Data/Announcement.json");

module.exports = async (App, Client) => {
    App.get(
        "/dashboard",
        catchAsyncErrors(async (Request, Response) => {
            try {
                if (!Request.user) return Response.redirect("/");

                const User = Get_Database_User(Request.user.id);
                const Decrypted_Tokens = Decrypt_Tokens(User.access, User.refresh);
                const User_Guilds = await Get_User_Guilds(Decrypted_Tokens.Access_Token, Client);

                Response.render("dashboard/index", {
                    Guilds: User_Guilds,
                    User: JSON.stringify({
                        Username: Request.user?.username,
                        Tag: Request.user?.tag,
                        Icon: Request.user?.icon,
                    }),
                    Username: Request.user?.username,
                    Latest_Announcement: Latest_Announcement === null || Latest_Announcement.Message === "" || Latest_Announcement.ID === "" || Latest_Announcement.ID === null ? null : Latest_Announcement,
                });
            } catch (Error) {
                console.log(`Failed to load dashboard.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );

    App.get(
        "/dashboard/:id",
        catchAsyncErrors(async (Request, Response) => {
            try {
                if (!Request.user) return Response.redirect("/");

                const User = Get_Database_User(Request.user.id);
                const User_Guilds = await Get_User_Guilds(User.access, Client);
                const Guild = User_Guilds.find((Guild) => Guild.id === Request.params.id);

                if (!Guild && Guild.owner != true && Guild.permissions != "1099511627775") return Response.redirect("/dashboard");

                const Guild_Settings = Global_Databases.Moderation[Guild.id];

                if (!Guild_Settings) return Response.redirect("/dashboard");

                Response.render("dashboard/Core/index", {
                    Guild: Guild,
                    Guild_Settings: Guild_Settings,
                    User: JSON.stringify({
                        Username: Request.user?.username,
                        Tag: Request.user?.tag,
                        Icon: Request.user?.icon,
                    }),
                    Latest_Announcement: Latest_Announcement === null || Latest_Announcement.Message === "" || Latest_Announcement.ID === "" || Latest_Announcement.ID === null ? null : Latest_Announcement,
                });
            } catch (Error) {
                console.log(`Failed to load server dashboard.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );
};
