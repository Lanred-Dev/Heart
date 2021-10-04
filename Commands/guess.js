const Awaiting_Repsonse = new Set();
const Embed = Global_Functions.Base_Embed;

module.exports = {
    name: "guess",
    aliases: [],
    category: "fun",
    setup: "guess [Guess]",
    show_aliases: true,
    description: "Can you guess the number?",

    async execute(Message, Message_Args, Client) {
        if (Awaiting_Repsonse.has(Message.author.id)) return;

        const Zone_1 = Math.floor(Math.random() * 95) + 5;
        const Zone_2 = Math.floor(Math.random() * (Zone_1 - 5 + 1)) + 5;
        const Answer = Math.floor(Math.random() * (Zone_1 - Zone_2 + 1)) + Zone_2;

        Message.channel.send({embeds: [Embed(`${Message.author.toString()}, the number is in between **${Zone_2}**-**${Zone_1}**.`)]})
            .then(() => {
                const Message_Await_Filter = Collected_Message => Collected_Message.values().next().value.author.id === Message.author.id;

                Message.channel.awaitMessages({
                        Message_Await_Filter,
                        max: 1,
                        time: 10000,
                        errors: ["time"]
                    })
                    .then(Collected_Message => {
                        if (Collected_Message.values().next().value.first().content === Answer.toString()) {
                            Message.channel.send({embeds: [Embed(`${Message.author.toString()}, correct!`)]});
                        } else {
                            Message.channel.send({embeds: [Embed(`${Message.author.toString()}, incorrect! The number was **${Answer}**.`)]});
                        }

                        Awaiting_Repsonse.delete(Message.author.id);
                    })
                    .catch(() => {
                        Message.channel.send({embeds: [Embed(`${Message.author.toString()}, you did not guess in time.`)]});
                        Awaiting_Repsonse.delete(Message.author.id);
                    });
            });

        Awaiting_Repsonse.add(Message.author.id);
    }
};