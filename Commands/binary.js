const Ambulance_Embed = Global_Functions.Ambulance_Embed;

module.exports = {
    name: "binary",
    aliases: ["convertbinary"],
    category: "fun",
    setup: "binary [Message]",
    show_aliases: true,
    description: "Takes the provided message and converts it to binary!",

    async execute(Message, Message_Args, Client) {
        const Unconverted = Message_Args.slice(0).join(" ");

        if (!Unconverted) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a message to convert.`)]
        });
        if (Unconverted.length >= 1000) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a message under 1000 characters.`)]
        });

        const Converted = Unconverted.split("").map(function (Character) {
            return Character.charCodeAt(0).toString(2);
        }).join(" ");

        if (!Converted) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, I was unable to convert the message.`)]
        });

        Message.channel.send(Converted)
            .catch(Error => {
                console.log(`Failed to convert message to binary.\nError: ${Error}`);
                Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, I was unable to convert the message.`)]
                });
            });
    }
};