const Discord = require("discord.js");
const Slots = ["<:Raspberry:874407060949843979>", "<:Blackberry:874407164385587230>", ":notes:", ":seven:", ":no_entry:"];
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Embed(Slot_1, Slot_2, Slot_3, Status) {
    const Embed = new Discord.MessageEmbed().setTitle(`${Slot_1} ${Slot_2} ${Slot_3}`).setDescription(Status).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "slots",
    aliases: [],
    category: "currency",
    setup: "slots [Bet]",
    show_aliases: true,
    description: "A way to gamble all your money away.",

    async execute(Message, Message_Args, Client) {
        let Bet = Message_Args[0];

        if (!Bet) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a bet.")] });
        if (isNaN(Bet) || !parseInt(Bet)) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a valid bet.")] });

        Bet = parseInt(Math.floor(Bet));

        if (Bet < 1) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a amount greater than 0.")] });
        if (Bet > 10000) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a amount less than 10000.")] });
        if (Bet > Global_Databases.Users[Message.author.id].wallet) return Message.channel.send({ embeds: [Ambulance_Embed(`You dont have **${Bet}**:coin: in your wallet to bet.`)] });

        let Slot_1 = Slots[Math.floor(Math.random() * Slots.length)];
        let Slot_2 = Slots[Math.floor(Math.random() * Slots.length)];
        let Slot_3 = Slots[Math.floor(Math.random() * Slots.length)];
        let Payout = 0;
        let Status = "";

        if (Slot_1 === Slot_2 && Slot_1 === Slot_3 && Math.floor(Math.random() * 20) > 4) {
            Slot_1 = Slots[Math.floor(Math.random() * Slots.length)];

            if (Slot_2 === Slot_3 && Math.floor(Math.random() * 20) > 3) {
                Slot_2 = Slots[Math.floor(Math.random() * Slots.length)];
            }
        }

        if ((Slot_1 === Slot_2 || Slot_1 === Slot_3) && Math.floor(Math.random() * 10) > 2) {
            Slot_1 = Slots[Math.floor(Math.random() * Slots.length)];
        }

        if (Slot_2 === Slot_3 && Math.floor(Math.random() * 10) > 1) {
            Slot_2 = Slots[Math.floor(Math.random() * Slots.length)];
        }

        if (Slot_1 === Slot_2 && Slot_1 === Slot_3) {
            if (Math.floor(Math.random() * 10000) === 10000) {
                Payout = Bet * 1000;
                Status = `${Message.author.toString()}, JACKPOT!!! :party: Your payout is **${Payout}**:coin:!`;
            } else {
                Payout = Bet * 4;
                Status = `${Message.author.toString()}, your payout is **${Payout}**:coin:!`;
            }
        } else if (Slot_1 === Slot_2 || Slot_1 === Slot_3 || Slot_2 === Slot_3) {
            Payout = Bet * 2;
            Status = `${Message.author.toString()}, your payout is **${Payout}**:coin:!`;
        } else {
            Payout = -Bet;
            Status = `${Message.author.toString()}, you lost your bet of **${Bet}**:coin:!`;
        }

        Global_Databases.Users[Message.author.id].wallet += Payout;

        Message.channel.send({ embeds: [Embed(Slot_1, Slot_2, Slot_3, Status, Message.author.toString())] });
    },
};
