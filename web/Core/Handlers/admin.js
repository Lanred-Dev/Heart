const Bot_Admins = process.env.BOT_ADMINS.split(",");
const catchAsyncErrors = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};

module.exports = async (App) => {
    App.get(
        "/admin",
        catchAsyncErrors(async (Request, Response) => {
            try {
                if (!Request.user || !Bot_Admins.find((Gotten_User) => Gotten_User === Request.user.id)) return Response.redirect("/errors/401");

                Response.render("admin/index", {
                    User: JSON.stringify({
                        Username: Request.user?.username,
                        Tag: Request.user?.tag,
                        Icon: Request.user?.icon,
                    }),
                });
            } catch (Error) {
                console.log(`Failed to load admin index page.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );

    App.get(
        "/admin/posts/announcement",
        catchAsyncErrors(async (Request, Response) => {
            try {
                if (!Request.user || !Bot_Admins.find((Gotten_User) => Gotten_User === Request.user.id)) return Response.redirect("/errors/401");

                Response.render("admin/posts/announcement", {
                    User: JSON.stringify({
                        Username: Request.user?.username,
                        Tag: Request.user?.tag,
                        Icon: Request.user?.icon,
                    }),
                });
            } catch (Error) {
                console.log(`Failed to load admin index page.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );
};
