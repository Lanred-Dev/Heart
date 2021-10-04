const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Embed = Global_Functions.Base_Embed;
const Get_Member = Global_Functions.Get_Member;

function Rob_Embed(User, Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":man_detective: [Robber noises] :man_detective:")
        .setDescription(`${User}, ${Status}.`)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Arrested_Embed(User_Bank, User_Wallet, User, Target_User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":rotating_light: [Sirens] :rotating_light:")
        .setDescription(`${User}, you were caught while trying to rob ${Target_User}!\n${User_Bank != 0 ? "You have been sent to jail and you have lost 75% of the money in your bank" : User_Bank != 0 ? "." : ""}${User_Wallet != 0 ? "and all the money in your wallet." : User_Bank != 0 ? "." : ""}`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "rob",
    aliases: [],
    category: "currency",
    setup: "rob [User]",
    show_aliases: true,
    description: "want to take someones money that they worked hard for?",
    cooldown: 60000,

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args);

        if (!Member) return;
        if (Member === Message.member) return Message.channel.send({embeds: [Ambulance_Embed("You cant rob yourself.")]});
        if (!Users_Database.Currency[Member.id]) return Message.channel.send({embeds: [Ambulance_Embed(`Sorry but I was unable to find anything for ${Member.toString()}. <:3421_pepesadfriendhug:837463376548331560>`)]});

        var Cops_Max_Chance = 1;
        var Cops_Chance = Math.floor(Math.random() * Max_Chance / Users_Database.Currency[Message.author.id].rob_points != 0 ? Users_Database.Currency[Message.author.id].rob_points : 1) + 1;
        var Max_Chance = 100;
        var Chance = Math.floor(Math.random() * Max_Chance) + 1;

        if (Users_Database.Currency[Message.author.id].rob_points >= 500) {
            Chance = 1;
            Max_Chance = 1;
        }

        if (Cops_Chance >= Cops_Max_Chance) {
            Users_Database.Currency[Message.author.id].wallet = 0;
            Users_Database.Currency[Message.author.id].bank = Math.floor((75 / 100) * Users_Database.Currency[Message.author.id].bank);

            Message.channel.send({embeds: [Arrested_Embed(Users_Database.Currency[Member.id].bank, Users_Database.Currency[Member.id].wallet, Message.author.toString(), Member.toString())]});

            return;
        }

        if (Chance >= Max_Chance) {
            var Amount = 0;

            if (Users_Database.Currency[Member.id].wallet <= 1000) {
                Amount = Users_Database.Currency[Member.id].wallet;
            } else {
                Amount = Math.floor(Users_Database.Currency[Member.id].wallet / (Math.random() * 1000) + 1);

                if (Amount > 10000 && Amount <= Users_Database.Currency[Member.id].wallet) {
                    Amount = 10000;
                } else if (Amount > Users_Database.Currency[Member.id].wallet) {
                    Amount = Users_Database.Currency[Member.id].wallet;
                }
            }

            if (Amount > 0) {
                Users_Database.Currency[Member.id].wallet -= Amount;
                Users_Database.Currency[Message.author.id].wallet += Amount;

                if (Users_Database.Currency[Message.author.id].rob_points < 500) {
                    Users_Database.Currency[Member.id].rob_points++;
                }

                Member.send({embeds: [Embed(`**${Message.author.tag}** robbed your wallet in **${Message.guild.name}**!`)]}).catch();
                Message.channel.send({embeds: [Rob_Embed(Message.author.toString(), `you robbed ${Member.toString()} for **${Amount}**:coin:`)]});
            } else {
                Message.channel.send({embeds: [Rob_Embed(Message.author.toString(), `you got nothing out of ${Member.toString()}`)]});
            }
        } else {
            Message.channel.send({embeds: [Rob_Embed(Message.author.toString(), `you failed snatch ${Member.toString()}'s wallet`)]});
        }
    }
};