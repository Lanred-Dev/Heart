const Ambulance_Embed = require("../Ambulance_Embed_Self.js");

module.exports = {
    name: "Get_Member",

    execute(Message, Message_Args, Can_Be_Self) {
        const User = Message.mentions.users.first() || Message.guild.members.cache.get(Message_Args[0]);

        if (Can_Be_Self != null && Can_Be_Self === true && !User) {
            return Message.member;
        } else if (!User) {
            Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a user.`)]
            });

            return null;
        }

        const Member = Message.guild.members.cache.get(User.id);

        if (!Member) {
            Message.channel.send({
                embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a user.`)]
            });

            return null;
        }

        return Member;
    }
};