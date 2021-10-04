const DiscordAPI = require("discord.js");
const fsAPI = require("fs");
const randomWordsAPI = require("random-words");
const Jobs = require("../Core/utils/Data/Jobs.json");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Activities = [
    function () {
        const Words = randomWordsAPI(30);
        const Word = Words[Math.floor(Math.random() * Words.length)];

        return {
            Status: `Flip **${Word}**`,
            Answer: Reverse_String(Word),
            Status_2: `The word, flipped, was ${Reverse_String(Word)}.`
        };
    },
    function () {
        const Words = randomWordsAPI(30);
        const Word = Words[Math.floor(Math.random() * Words.length)];

        return {
            Status: `Unflip **${Reverse_String(Word)}**`,
            Answer: Word,
            Status_2: `The word, unflipped, was ${Word}.`
        };
    },
    function () {
        const Words = randomWordsAPI(30);
        const Word = Words[Math.floor(Math.random() * Words.length)];

        return {
            Status: `Unscramble **${Scramble_String(Word)}**`,
            Answer: Word,
            Status_2: `The word, unscrambled, was ${Word}.`
        };
    },
    function () {
        const Number_1 = Math.floor(Math.random() * 250);
        const Number_2 = Math.floor(Math.random() * 250);
        const Answer = Number_1 + Number_2;

        return {
            Status: `Add **${Number_1}** and **${Number_2}**`,
            Answer: Answer,
            Status_2: `The answer was ${Answer}.`
        };
    },
    function () {
        const Number_1 = Math.floor(Math.random() * 250);
        const Number_2 = Math.floor(Math.random() * 250);
        const Answer = Number_1 - Number_2;

        return {
            Status: `Subtract **${Number_1}** and **${Number_2}**`,
            Answer: Answer,
            Status_2: `The answer was ${Answer}.`
        };
    },
    function () {
        const Words = randomWordsAPI(30);
        const Word = Words[Math.floor(Math.random() * Words.length)];
        const Word_Characters = Word.split("");
        var Characters = "";
        const Need_Characters = Word_Characters.length < 3 ? 2 : Word_Characters.length < 5 ? 3 : Word_Characters.length < 10 ? 5 : Word_Characters.length < 20 ? 10 : 10;

        for (var Current = 0; Current < Need_Characters; Current++) {
            Characters = `${Characters + Word_Characters[Current]}`;
        }

        return {
            Status: `Guess the word based of these characters **${Characters}**`,
            Answer: Word,
            Status_2: `The word was ${Word}.`
        };
    }
];

function Pay_Embed(Job, Amount, User, Work_Status, Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Job)
        .setDescription(`${User}, you have been payed **${Amount}**:coin: for your **${Work_Status}** work.`)
        .setFooter(Work_Status != "hard" ? Status : "")
        .setColor(Global_Embed_Color);

    return Embed;
}

function Prompt_Embed(Job, User, Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Job)
        .setDescription(`${User}, ${Status}.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Reverse_String(String) {
    return String.split("").reverse().join("");
}

function Scramble_String(String) {
    const Characters = String.split("");

    for (var Current = 0; Characters.length > Current; Current++) {
        const Random_Index = Math.floor(Math.random() * Current);
        const Old_Current = Characters[Current];

        Characters[Current] = Characters[Random_Index];
        Characters[Random_Index] = Old_Current;
    }

    return Characters.join("");
}

module.exports = {
    name: "work",
    aliases: [],
    category: "currency",
    setup: "work",
    show_aliases: true,
    cooldown: 900000,
    description: "*work*",

    async execute(Message, Message_Args, Client) {
        if (Users_Database.Currency[Message.author.id].job === null) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have a job.`)]
        });

        var Job = Users_Database.Currency[Message.author.id].job;
        var Found_Job = false;
        var Real_Job = null;

        for (var Gotten_Job = 0; Jobs.length > 0; Gotten_Job++) {
            if (Jobs[Gotten_Job].Name.toLowerCase() === Job.toLowerCase()) {
                Real_Job = Jobs[Gotten_Job];
                Found_Job = true;

                break;
            }
        }

        if (Found_Job === false) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find your job, **${Job}**. Maybe it is no longer a job?`)]
        });

        const Activity = Activities[Math.floor(Math.random() * Activities.length)]();
        const Status = Activity.Status_2;
        const Answer = Activity.Answer;
        var Answer_Time = Real_Job.Rank === 2 ? 10000 : Real_Job.Rank === 2 ? 7000 : 12000;
        const Message_Await_Filter = Collected_Message => Collected_Message.values().next().value.author.id === Message.author.id;

        Message.channel.send({
                embeds: [Prompt_Embed(`${Real_Job.Emoji} ${Real_Job.Name} ${Real_Job.Emoji}`, Message.author.toString(), Activity.Status)]
            })
            .then(() => {
                Message.channel.awaitMessages({
                        Message_Await_Filter,
                        max: 1,
                        time: Answer_Time,
                        errors: ["time"]
                    })
                    .then(Collected_Message => {
                        if (Collected_Message.values().next().value.first().content === Answer.toString()) {
                            var Money = Math.floor(Real_Job.Pay / ((Math.random() * 100) + 50));

                            if (Money < 10 && Money < Real_Job.Pay) {
                                Money = 6;
                            } else if (Money < Math.floor(Real_Job.Pay / 2)) {
                                Money = Math.floor(Real_Job.Pay / 2);
                            }

                            Users_Database.Currency[Message.author.id].hours_worked += 0.5;

                            Message.channel.send({
                                embeds: [Pay_Embed(`${Real_Job.Emoji} ${Real_Job.Name} ${Real_Job.Emoji}`, Money, Message.author.toString(), "hard", Status)]
                            });
                        } else {
                            const Money = Real_Job.Pay <= 10 ? 3 : Real_Job.Pay <= 50 ? 10 : Real_Job.Pay <= 150 ? 25 : Real_Job.Pay <= 500 ? 50 : Math.floor(15 * (Real_Job.Pay / 100));
                            Users_Database.Currency[Message.author.id].hours_worked += 0.25;

                            Message.channel.send({
                                embeds: [Pay_Embed(`${Real_Job.Emoji} ${Real_Job.Name} ${Real_Job.Emoji}`, Money, Message.author.toString(), "terrible", Status)]
                            });
                        }

                        Users_Database.Currency[Message.author.id].bank += Money;
                        fsAPI.writeFileSync("Core/Databases/Users-Database.json", JSON.stringify(Users_Database, null, 0));
                    })
                    .catch(() => {
                        const Money = Real_Job.Pay <= 10 ? 3 : Real_Job.Pay <= 50 ? 10 : Real_Job.Pay <= 150 ? 25 : Real_Job.Pay <= 500 ? 50 : Math.floor(15 * (Real_Job.Pay / 100));
                        Users_Database.Currency[Message.author.id].hours_worked += 0.25;

                        Message.channel.send({
                            embeds: [Pay_Embed(`${Real_Job.Emoji} ${Real_Job.Name} ${Real_Job.Emoji}`, Money, Message.author.toString(), "terrible", Status)]
                        });

                        Users_Database.Currency[Message.author.id].bank += Money;
                        fsAPI.writeFileSync("Core/Databases/Users-Database.json", JSON.stringify(Users_Database, null, 0));
                    });
            });
    }
};