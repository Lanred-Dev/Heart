const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Log_Embed(Role, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription("I have added/updated the poll role.")
        .setColor(Global_Embed_Color)
        .addFields({
            name: "Role",
            value: Role,
            inline: true
        }, {
            name: "User",
            value: User,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "pollrole",
    aliases: ["prset"],
    category: "utility",
    setup: "pollrole [Role Name]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Will set the poll role! Whenever you host a poll the bot will the ping the given role!",

    async execute(Message, Message_Args, Client, Command) {
        const Role_Name = Message_Args.join(" ");
        const Role = Message.guild.roles.cache.find((Gotten_Role) => {
            return Gotten_Role.name === Role_Name;
        });

        if (!Role) return Message.channel.send({
            embeds: [Ambulance_Embed("Please provide a role.")]
        });

        Message.channel.send({
            embeds: [
                new DiscordAPI.MessageEmbed()
                .setTitle("🗳️ Poll 🗳️")
                .setDescription(`The poll role has been changed.`)
                .setColor(Global_Embed_Color)
            ]
        });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel) Log_Channel.send({
            embeds: [Log_Embed(Role.toString(), Message.author.toString())]
        });

        Moderation_Database[Message.guild.id].poll_role = Role_Name;
    }
};