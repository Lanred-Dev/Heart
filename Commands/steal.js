const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Base_Embed = Global_Functions.Base_Embed;
const Get_Member = Global_Functions.Get_Member;
const User_Database = Global_Databases.Users;

function Steal_Embed(User, Status) {
    const Embed = new Discord.MessageEmbed().setTitle(":man_detective: [Robber noises] :man_detective:").setDescription(`${User}, ${Status}.`).setColor(Global_Embed_Color);

    return Embed;
}

function Arrested_Embed(User_Bank, User_Wallet, User, Target_User) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(":rotating_light: [Sirens] :rotating_light:")
        .setDescription(`${User}, you were caught while trying to rob ${Target_User}.\n${User_Bank != 0 ? " You have been sent to jail and you have lost 75% of the money in your bank" : User_Bank != 0 ? "." : ""}${User_Wallet != 0 ? " and all the money in your wallet." : User_Bank != 0 ? "." : ""}`)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("steal")
        .setDescription("yk they worked hard for that money")
        .addUserOption((Option) => Option.setName("user").setDescription("The user").setRequired(true)),
    category: "currency",
    cooldown: 60000,

    async execute(Interaction, Client) {
        const Member = Get_Member(Interaction, false, false, "you cant rob yourself");

        if (!Member) return;
        if (Member === Client.member) {
            User_Database[Interaction.user.id].bank -= 1000;

            return Interaction.reply({ embeds: [Base_Embed(`${Interaction.user.toString()} oh nono, you cant do that. **-1000**:coin:`)] });
        }

        if (!User_Database[Member.id]) return Interaction.reply({ embeds: [Ambulance_Embed(`<:3421_pepesadfriendhug:837463376548331560> ${Interaction.user.toString()}, I was unable to find anything for ${Member === Interaction.member ? "you" : Member.toString()}.`)] });

        let Cops_Max_Chance = 10 * (User_Database[Interaction.user.id].rob_points != 0 ? User_Database[Interaction.user.id].rob_points : 1);
        let Cops_Chance = Math.floor(Math.random() * Cops_Max_Chance) + 1;
        let Max_Chance = 100;
        let Chance = Math.floor(Math.random() * Max_Chance) + 1;

        if (User_Database[Interaction.user.id].rob_points >= 500) {
            Chance = 1;
            Max_Chance = 1;
        }

        if (Cops_Chance >= Cops_Max_Chance) {
            User_Database[Interaction.user.id].wallet = 0;
            User_Database[Interaction.user.id].bank = Math.floor((75 / 100) * User_Database[Interaction.user.id].bank);

            Interaction.reply({ embeds: [Arrested_Embed(User_Database[Member.id].bank < 0 ? 0 : User_Database[Member.id].bank, User_Database[Member.id].wallet, Interaction.user.toString(), Member.toString())] });

            return;
        }

        if (Chance >= Max_Chance) {
            let Amount = 0;

            if (User_Database[Member.id].wallet <= 1000) {
                Amount = User_Database[Member.id].wallet;
            } else {
                Amount = Math.floor(User_Database[Member.id].wallet / (Math.random() * 1000) + 1);

                if (Amount > 10000 && Amount <= User_Database[Member.id].wallet) {
                    Amount = 10000;
                } else if (Amount > User_Database[Member.id].wallet) {
                    Amount = User_Database[Member.id].wallet;
                }
            }

            if (Amount > 0) {
                User_Database[Member.id].wallet -= Amount;
                User_Database[Interaction.user.id].wallet += Amount;

                if (User_Database[Interaction.user.id].rob_points < 500) {
                    User_Database[Member.id].rob_points++;
                }

                Member.send({ embeds: [Base_Embed(`**${Interaction.user.tag}** robbed your wallet in **${Interaction.guild.name}**!`)] }).catch();
                Interaction.reply({ embeds: [Steal_Embed(Interaction.user.toString(), `you robbed ${Member.toString()} for **${Amount}**:coin:`)] });
            } else {
                Interaction.reply({ embeds: [Steal_Embed(Interaction.user.toString(), `you got nothing out of ${Member.toString()}`)] });
            }
        } else {
            Interaction.reply({ embeds: [Steal_Embed(Interaction.user.toString(), `you failed snatch ${Member.toString()}'s wallet`)] });
        }
    },
};
