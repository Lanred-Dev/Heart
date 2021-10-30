const fsAPI = require("fs");

module.exports = {
    name: "Get_oauth_Database_User",

    execute(Session_ID) {
        return JSON.parse(fsAPI.readFileSync("web/Core/Databases/oauth.json")).find(User => User.id === Session_ID);
    }
};