const Discord = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Currency_Disabled_Ambulance_Embed = Global_Functions.Currency_Disabled_Ambulance_Embed;
const Moderation_Database = Global_Databases.Moderation;
const User_Database = Global_Databases.Users;

function Dice_Embed(Roll_1, Roll_2, Status, User) {
    const Embed = new Discord.MessageEmbed().setTitle("🎲 [Dice noises] 🎲").setDescription(`:eyes: he rolles\n\n${User} Rolled\n***${Roll_1}***\n\nI Rolled\n***${Roll_2}***\n\n${Status}`).setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "dice",
    aliases: ["roll", "rollgamedice"],
    category: "fun",
    setup: "dice",
    show_aliases: true,
    description: "And... and... and they roll!",

    async execute(Message, Message_Args, Client) {
        if (Moderation_Database[Message.guild.id].currency_system) return Message.channel.send({ embeds: [Currency_Disabled_Ambulance_Embed()] });

        let Bet = Message_Args[0];
        let Betting = true;

        if (!Bet) (Betting = false), (Bet = 0);
        if (isNaN(Bet) || (!parseInt(Bet) && Betting === true)) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a valid bet.")] });

        Bet = parseInt(Math.floor(Bet));

        if (Bet < 1 && Betting != false) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a amount greater than 0.")] });
        if (Bet > 1000 && Betting != false) return Message.channel.send({ embeds: [Ambulance_Embed("Please provide a amount less than 1000.")] });
        if (Bet > User_Database[Message.author.id].wallet && Betting != false) return Message.channel.send({ embeds: [Ambulance_Embed(`You dont have **${Bet}**:coin: in your wallet to bet.`)] });

        const Roll_1 = Math.floor(Math.random() * 6) + 1;
        const Roll_2 = Math.floor(Math.random() * 6) + 1;
        let Payout = 0;
        let Status = "";

        if (Roll_1 > Roll_2) {
            if (Bet > 0) {
                Status = `You win! You earned **${Bet * 2}**:coin:.`;
            } else {
                Status = `You win!`;
            }

            if (Betting) {
                Payout = Betting * 2;
            }
        } else if (Roll_1 < Roll_2) {
            if (Betting > 0) {
                Status = `You lose! You lost your bet of **${Bet}**:coin:.`;
            } else {
                Status = `You lose!`;
            }

            if (Betting) {
                Payout = -Payout;
            }
        } else {
            if (Betting > 0) {
                Status = `Tie! You have been givin back your bet of **${Bet}**:coin:.`;
            } else {
                Status = `Tie!`;
            }

            if (Betting) {
                Payout = 0;
            }
        }

        User_Database[Message.author.id].wallet += Payout;

        Message.channel.send({ embeds: [Dice_Embed(Roll_1, Roll_2, Status, Message.author.toString())] });
    },
};
