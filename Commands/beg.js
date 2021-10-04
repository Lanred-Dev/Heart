const DiscordAPI = require("discord.js");
const Begs = {
    1: [{
        Person: ":older_man: Some random old man :older_man:",
        Status: "get out of here kid, we had to work for our money in the good old days."
    }, {
        Person: ":older_woman: Granny :older_woman:",
        Status: "Now sunny you know that you have to work for your money"
    }, {
        Person: ":man_police_officer: Police Officer :man_police_officer:",
        Status: "wtf are you homeless?"
    }, {
        Person: ":men_wrestling: Dwayne Johnson :men_wrestling:",
        Status: "I am da rock and I say no money for you"
    }, {
        Person: ":crab: Mr. Crabs :crab:",
        Status: "arg arg arg no money for youo!"
    }, {
        Person: "Iron man",
        Status: "I am to busy, saving the world, to run a homeless shelter"
    }, {
        Person: "Donald Trump",
        Status: "nah"
    }, {
        Person: "Random Person",
        Status: "Everybody is a genius. They said, guess they were wrong."
    }, {
        Person: "Joe Biden",
        Status: "kids these days"
    }, {
        Person: ":robot:",
        Status: "01010111 01101000 01111001 00100000 01100001 01110010 01100101 00100000 01111001 01101111 01110101 00100000 01100111 01100001 01111001 00111111"
    }, {
        Person: ":robot:",
        Status: "01110000 01101111 01101111 01110010"
    }],
    2: [{
        Person: ":men_wrestling: John Cena :men_wrestling:",
        Status: "Take some left overs kid."
    }, {
        Person: "Donald Trump",
        Status: "I am rich anyways"
    }, {
        Person: ":man_golfing: Tiger Woods :man_golfing:",
        Status: "I play golf"
    }, {
        Person: "Iron man",
        Status: "IRON MON <:Pog:836464253215965185>"
    }, {
        Person: "<:Pog:836464253215965185> Elon Musk <:Pog:836464253215965185>",
        Status: "Take a **tesla**! ||jk :joy:, but here take some money||"
    }, {
        Person: "Will Smith",
        Status: "You can do it, you can!"
    }, {
        Person: ":robot:",
        Status: "01010100 01100001 01100111 00100000 01110011 01101111 01101101 01100101 00100000 01101101 01101111 01101110 01100101 01111001 00101100 00100000 01100001 01101100 01110011 01101111 00100000 01110111 01101000 01111001 00100000 01100001 01110010 01100101 00100000 01111001 01101111 01110101 00100000 01110000 01101111 01101111 01110010 00111111"
    }],
    3: [{
        Person: ":judge: Judge Judy :judge:",
        Status: "Dont break the law or else <:9117_PepeSwat:837127039458213918>"
    }, {
        Person: "Some wise guy",
        Status: "It will make the world a better place, spend it wisely."
    }],
    4: [{
        Person: "Tiktok girl",
        Status: "Take all my money, tehe, BUT you must be in my **tiktok**"
    }, {
        Person: "Tom Hanks",
        Status: "Tom Hanks :eyes: ||RUN FOREST RUN||"
    }, {
        Person: "Will Smith",
        Status: "Aim to be the greatest."
    }, {
        Person: "**You**",
        Status: "I will just give myself money"
    }, {
        Person: "Alien",
        Status: "⒉⯄ⶩⵕ╖⻈⺁ⳟⓉ⩫⥘➘⬍⢚⎰ⳛ⚎⿊Ⅺ◘┮⅊❼⢯ⲽ⦛∏⿝④"
    }]
}

function Beg_Embed(Status, Person, Footer) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Person)
        .setDescription(Status)
        .setColor(Global_Embed_Color)
        .setFooter(Footer);

    return Embed;
}

module.exports = {
    name: "beg",
    aliases: ["moneybyaskingpeopleforit"],
    category: "currency",
    setup: "beg",
    show_aliases: true,
    cooldown: 10000,
    description: "Want to earn money but you dont want to work for it?",

    async execute(Message, Message_Args, Client) {
        const Money_Chance = Math.floor(Math.random() * 100);
        var Money = Math.floor(Math.random() * 100);
        var Status = "";
        var Footer = "";

        if (Money_Chance >= 100) {
            Money = Math.floor(1000 + Math.random() * 500);
            Footer = `POG THE BIGGEST OF BIG PAYOUTS, ${Money} dollars!!!`;
            Status = Begs[4][Math.floor(Math.random() * Begs[4].length)];
        } else if (Money_Chance > 80) {
            Money = Math.floor(100 + Math.random() * 250);
            Footer = `BIG PAYOUT, ${Money} dollars`;
            Status = Begs[2][Math.floor(Math.random() * Begs[2].length)];
        } else if (Money_Chance < 75) {
            Money = 0;
            Footer = "No money for you";
            Status = Begs[1][Math.floor(Math.random() * Begs[1].length)];
        } else {
            Footer = `${Money} dollars`;
            Status = Begs[3][Math.floor(Math.random() * Begs[3].length)];
        };

        Users_Database.Currency[Message.author.id].wallet += Money;

        Message.channel.send({embeds: [Beg_Embed(Status.Status, Status.Person, Footer)]});
    }
};