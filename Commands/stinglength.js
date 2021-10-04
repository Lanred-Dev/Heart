const Ambulance_Embed = Global_Functions.Ambulance_Embed;

module.exports = {
    name: "stringlength",
    aliases: [],
    category: "fun",
    setup: "stringlength [String]",
    show_aliases: true,
    description: "Want to see how long a string is?",

    async execute(Message, Message_Args, Client) {
        const String = Message_Args.slice(0).join(" ");

        if (!String) return Message.channel.send({embeds: [Ambulance_Embed("Please provide a string.")]});

        Message.channel.send(`The string length is **${String.length} characters**.`);
    }
};