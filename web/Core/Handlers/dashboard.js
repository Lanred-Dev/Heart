const Get_Database_User = Global_Functions.web_utils.Get_oauth_Database_User;
const Get_User_Guilds = Global_Functions.web_utils.Get_User_Guilds;
const Moderation_Database = Global_Databases.Moderation;
const catchAsyncErrors = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

module.exports = async (App, Client, Latest_Announcement) => {
    App.get("/dashboard", catchAsyncErrors(async (Request, Response) => {
        try {
            if (!Request.user) return Response.redirect("/index");

            const Database_User = Get_Database_User(Request.user.id);

            Response.render("dashboard/index", {
                Guilds: await Get_User_Guilds(Database_User.access, Client),
                User: JSON.stringify({
                    Username: Request.user?.username,
                    Tag: Request.user?.tag,
                    Icon: Request.user?.icon
                }),
                Latest_Announcement: Latest_Announcement
            });
        } catch (Error) {
            console.log(`Failed to load dashboard.\nError: ${Error}`);
            Response.redirect("/errors/500");
        };
    }));

    App.get("/dashboard/:id", catchAsyncErrors(async (Request, Response) => {
        try {
            if (!Request.user) return Response.redirect("/index");

            const Database_User = Get_Database_User(Request.user.id);
            const User_Guilds = await Get_User_Guilds(Database_User.access, Client);
            const Guild = User_Guilds.find(Guild => Guild.id === Request.params.id);

            if (!Guild && (Guild.owner === true || Guild.permissions === "1099511627775")) return Response.redirect("/dashboard");

            const Guild_Settings = Moderation_Database[Guild.id];

            if (!Guild_Settings) return Response.redirect("/dashboard");

            Response.render("dashboard/Core/index", {
                Guild: Guild,
                Guild_Settings: Guild_Settings,
                User: JSON.stringify({
                    Username: Request.user?.username,
                    Tag: Request.user?.tag,
                    Icon: Request.user?.icon
                })
            });

            console.log(Request.body.test)
        } catch (Error) {
            console.log(`Failed to load server dashboard.\nError: ${Error}`);
            Response.redirect("/errors/500");
        };
    }));
};