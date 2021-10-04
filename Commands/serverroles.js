const DiscordAPI = require("discord.js");
const Get_Server_Roles = Global_Functions.Get_Server_Roles;

function Info_Embed(Guild, Role_Count) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setColor(Guild.roles.highest.color)
        .setDescription(Get_Server_Roles(Guild, 1000))
        .setFooter(`❤ ${Guild.name} has ${Role_Count} roles`);

    return Embed;
}

module.exports = {
    name: "serverroles",
    aliases: ["sroles"],
    category: "utility",
    setup: "serverroles",
    show_aliases: true,
    description: "Want to see the server, that the command is used in, roles?",

    async execute(Message, Message_Args, Client) {
        const Role_Count = Message.guild.roles.cache.filter(Role => Role.deleted == false).size.toString();

        Message.channel.send({embeds: [Info_Embed(Message.guild, Role_Count)]});
    }
};