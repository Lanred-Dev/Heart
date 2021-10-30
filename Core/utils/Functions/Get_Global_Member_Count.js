module.exports = {
    name: "Get_Global_Member_Count",

    execute(Client) {
        var Member_Count = 0;

        Client.guilds.cache.forEach(Guild => {
            Member_Count += Guild.memberCount;
        });

        return Member_Count;
    }
};