const DiscordAPI = require("discord.js");
const Role_Emojis = [
    "1⃣",
    "2⃣",
    "3⃣",
    "4⃣",
    "5⃣",
];
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Reaction_Role_Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("Reaction Role")
        .setDescription("A new reaction role has been created.")
        .setColor(Global_Embed_Color);

    return Embed;
}

function Get_Message_ID(String) {
    var Match = String.match(/{messageid:.*}/gim);

    if (!Match) return null;

    var Replace_1 = Match[0].replace(/{messageid:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Roles(String) {
    var Match = String.match(/{roles:.*}/gim);

    if (!Match) return null;

    var Replace_1 = Match[0].replace(/{roles:\s?/gim, "");
    var Replace_2 = Replace_1.replace(/}.*/gim, "");

    return Replace_2.split("}\s?,\s?{");
}

function Get_DM_User(String) {
    var Match = String.match(/{dmuser:.*}/gim);

    if (!Match) return null;

    var Replace_1 = Match[0].replace(/{dmuser:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

module.exports = {
    name: "reactionrole",
    aliases: [],
    category: "utility",
    setup: "reactionrole {messageid: ID} {roles: {emoji: EmojiId, role: RoleId}, {emoji: EmojiId, role: RoleId}} {dmuser: True/False}",
    show_aliases: true,
    description: "Want some reaction roles?",

    async execute(Message, Message_Args, Client, Command) {
        if (!Moderation_Database.Reaction_Role_Messages[Message.guild.id]) Moderation_Database.Reaction_Role_Messages[Message.guild.id] = {};

        const Message_ID = Get_Message_ID(Message.content);
        const Roles = Get_Roles(Message.content);
        var DM_User = Get_DM_User(Message.content);

        if (!Message_ID) return Message.channel.send({embeds: [Ambulance_Embed("Please provide a message id.")]});
        if (!Roles || Roles.length < 1) return Message.channel.send({embeds: [Ambulance_Embed("Please provide roles.")]});
        if (Roles.length > 6) return Message.channel.send({embeds: [Ambulance_Embed("You can only have 5 or less roles.")]});
        if (!DM_User || DM_User != "true" && DM_User != "false") DM_User = "false";

        var Fetched_Message;

        await Message.channel.messages.fetch(Message_ID)
            .then(Gotten_Message => {
                Fetched_Message = Gotten_Message;
            })
            .catch(Error => {
                Fetched_Message = null;

                console.log(`Failed to fetch message for reaction roles.\nError: ${Error}`);
            });

        if (!Fetched_Message) return Message.channel.send({embeds: [Ambulance_Embed(`I was unable to find a message with the id of **${Message_ID}**.`)]});

        for (var Role = 0; Roles.length > Role; Role++) {
            Fetched_Message.react(Role_Emojis[Role]);
        };

        Message.channel.send({embeds: [Reaction_Role_Embed()]});

        Moderation_Database.Reaction_Role_Messages[Message.guild.id][Message_ID] = {
            channel: Fetched_Message.channel.id,
            roles: Roles,
            dm_user: DM_User
        };
    }
};