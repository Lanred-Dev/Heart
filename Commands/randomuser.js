const Embed = Global_Functions.Base_Embed;

module.exports = {
    name: "randomuser",
    aliases: ["ruser"],
    category: "fun",
    setup: "randomuser",
    show_aliases: true,
    description: "Chooses a random user!",

    async execute(Message, Message_Args, Client) {
        Message.channel.send({embeds: [Embed(`${Message.guild.members.cache.get(Message.guild.members.cache.random().user.id).tag} has been chosen!`)]});
    }
};