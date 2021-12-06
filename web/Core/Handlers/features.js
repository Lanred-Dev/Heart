const Shop = require("../../../Core/utils/Data/Shop.json");
const Latest_Announcement = require("../../../Core/utils/Data/Announcement.json");
const catchAsyncErrors = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};

module.exports = async (App) => {
    App.get(
        "/api/redirect",
        catchAsyncErrors(async (Request, Response) => {
            try {
				const URL = Request.query.url;

				if (!URL) return;

                Response.redirect(`/${URL}`);
            } catch (Error) {
                console.log(`Failed to redirect.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );

    App.get(
        "/features/shop",
        catchAsyncErrors(async (Request, Response) => {
            try {
                Response.render("features/shop", {
                    Shop: Shop,
                    User: JSON.stringify({
                        Username: Request.user?.username,
                        Tag: Request.user?.tag,
                        Icon: Request.user?.icon,
                    }),
                    Latest_Announcement: Latest_Announcement,
                });
            } catch (Error) {
                console.log(`Failed to load shop.\nError: ${Error}`);
                Response.redirect("/errors/500");
            }
        })
    );
};
