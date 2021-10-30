const fsAPI = require("fs");
const Databases = {
    moderation: "Core/Databases/Moderation-Database.json",
    users: "Core/Databases/Users-Database.json",
    sessions: "web/Core/Databases/Session.json",
    oauth: "web/Core/Databases/oauth.json"
}

module.exports = {
    name: "Get_Database",

    execute(Database_Name) {
        const Database = Databases[Database_Name.toLowerCase()];

        if (!Database) return;

        return JSON.parse(fsAPI.readFileSync(Database));
    }
};