const DiscordAPI = require("discord.js");

function Embed(User, Avatar) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription(User)
        .setImage(Avatar)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "randompfp",
    aliases: ["ruser", "randomavatar", "ravatar"],
    category: "fun",
    setup: "randomuser",
    show_aliases: true,
    description: "Chooses a random user!",

    async execute(Message, Message_Args, Client) {
        const Member = Message.guild.members.cache.get(Message.guild.members.cache.random().user.id);

        Message.channel.send({embeds: [Embed(Member.toString(), Member.user.displayAvatarURL({format: "jpg"}))]});
    }
};