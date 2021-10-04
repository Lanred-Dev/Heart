const DiscordAPI = require("discord.js");
const fsAPI = require("fs");

module.exports = async (Client, Event) => {
    const Event_Name = Event.t;

    if (Event_Name === "MESSAGE_REACTION_ADD") {
        return;

        if (!Moderation_Database.Reaction_Role_Messages[Event.d.guild_id]) Moderation_Database.Reaction_Role_Messages[Event.d.guild_id] = {}, fsAPI.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 2));

        const Reaction_Role = Moderation_Database.Reaction_Role_Messages[Event.d.guild_id][Event.d.message_id];

        if (!Reaction_Role) return;

        Client.on("messageReactionAdd", async (Reaction, User) => {
            if (Reaction.message.partial) await Reaction.message.fetch();
            if (Reaction.partial) await Reaction.fetch();
            if (User.bot || !Reaction.message.guild) return;

            if (Reaction.message.channel.id === Reaction_Role.channel) {
                if (Reaction_Role.roles[Reaction.emoji.name]) {
                    await Reaction.message.guild.members.cache.get(User.id).roles.add(Reaction_Role.roles[Reaction.emoji.name]);
                }
            } else {
                return;
            }
        });
    }
};