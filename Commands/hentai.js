const Embed = Global_Functions.Base_Embed;

module.exports = {
    name: "hentai",
    aliases: [],
    category: "meme",
    setup: "hentai",
    show_aliases: true,
    description: "...",

    async execute(Message, Message_Args, Client) {
        Message.channel.send({embeds: [Embed(`${Message.author.toString()}, dude wtf`)]});
    }
};