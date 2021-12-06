const Discord = require("discord.js");
const Option_Emojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;

function Poll_Embed(Title, Duration, Status, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(Title)
        .setDescription(Status)
        .setColor(Global_Embed_Color)
        .setFooter(`❤ ${Moderator}'s poll${Duration ? ` • Poll duration ${Duration}s` : ""}`);

    return Embed;
}

function Finish_Embed(Title, Duration, Status, Moderator) {
    const Embed = new Discord.MessageEmbed().setTitle(`${Title}, has ended!`).setDescription(Status).setColor(Global_Embed_Color).setFooter(`❤ ${Moderator}'s poll • Poll lasted ${Duration}s`);

    return Embed;
}

function Log_Embed(Channel, Moderator) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`A poll has started been started by ${Moderator}.`)
        .setColor(Global_Embed_Color)
        .addFields(
            {
                name: "Channel",
                value: Channel,
                inline: true,
            }
        )
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

function Get_Options(String) {
    const Match = String.match(/{options:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{options:\s?/gim, "");
    const Replace_2 = Replace_1.replace(/}.*/gim, "");

    return Replace_2.split(",");
}

function Get_Duration(String) {
    const Match = String.match(/{duration:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{duration:\s?/gim, "");
    const Replace_2 = Replace_1.replace(/}.*/gim, "");

    return Replace_2.replace(/\s+/g);
}

function Get_Title(String) {
    const Match = String.match(/{title:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{title:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

function Get_Description(String) {
    const Match = String.match(/{description:.*}/gim);

    if (!Match) return "";

    const Replace_1 = Match[0].replace(/{description:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

module.exports = {
    name: "poll",
    aliases: [],
    category: "utility",
    setup: "poll {title: Title} {description: Description} {duration: Duration} {options: Option1, Option2}",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Want to host some polls? Well we got you!",

    async execute(Message, Message_Args, Client, Command) {
        const Options = Get_Options(Message.content);
        const Description = Get_Description(Message.content);
        const Title = Get_Title(Message.content);
        const Duration = Get_Duration(Message.content);

        if (!Options || Options.length < 1)
            return Message.channel.send({
                embeds: [Ambulance_Embed("Please provide poll options.")],
            });
        if (Options.length > 6)
            return Message.channel.send({
                embeds: [Ambulance_Embed("You can only have 5 or less poll options.")],
            });
        if (!Title)
            return Message.channel.send({
                embeds: [Ambulance_Embed("Please provide a poll title.")],
            });
        if (Duration && isNaN(Duration))
            return Message.channel.send({
                embeds: [Ambulance_Embed("Please provide a valid poll duration.")],
            });
        if (Duration && Duration < 60)
            return Message.channel.send({
                embeds: [Ambulance_Embed("Poll duration has to be 60 seconds or more.")],
            });
        if (Duration && Duration > 172800)
            return Message.channel.send({
                embeds: [Ambulance_Embed("Poll duration cannot be over 48 hours.")],
            });

        let Status = Description != "" ? `${Discription}\n\n` : "";

        for (let Option = 0; Options.length > Option; Option++) {
            Status = `${Status}${Option != 0 ? "\n\n" : ""}${Option_Emojis[Option]} : ${Options[Option].toString().trimStart()}`;
        }

        const Role = Global_Databases.Moderation[Message.guild.id].poll_role;

        if (Role) {
            const Real_Role = Message.guild.roles.cache.find((Gotten_Role) => {
                return Gotten_Role.name.toLowerCase() === Role.toLowerCase();
            });

            if (Real_Role) {
                Message.channel.send({
                    embeds: [Real_Role.toString()],
                });
            }
        }

        Message.channel
            .send({
                embeds: [Poll_Embed(Title, Duration, Status, Message.author.tag)],
            })
            .then(function (Poll_Message) {
                for (let Option = 0; Options.length > Option; Option++) {
                    Poll_Message.react(Option_Emojis[Option]);
                }

                if (!Duration) return;

                setTimeout(() => {
                    const Reactions = Poll_Message.reactions.cache;
                    const Winner = {
                        Count: 0,
                        Reaction: 0,
                    };
                    let Tie = false;

                    for (let Option = 0; Options.length > Option; Option++) {
                        try {
                            const Reaction = Reactions.get(Option_Emojis[Option]);

                            if (Reaction) {
                                if (Reaction.count > Winner.Count) {
                                    Tie = false;
                                    Winner.Count = Reaction.count;
                                    Winner.Reaction = Option_Emojis[Option];
                                } else if (Reaction.count === Winner.Count) {
                                    Winner.Count = Reaction.count;
                                    Tie = true;
                                }
                            }
                        } catch (Error) {
                            console.log(`Failed to add poll reacton.\nError: ${Error}`);
                        }
                    }

                    if (Tie != true) {
                        let Finish_Status = Description != "" ? `${Discription}\n\n` : "";
                        let Total_Vote_Count = 0;

                        for (let Option = 0; Options.length > Option; Option++) {
                            try {
                                const Reaction = Reactions.get(Option_Emojis[Option]);

                                if (Reaction) {
                                    Total_Vote_Count += Reaction.count;
                                }
                            } catch (Error) {
                                console.log(`Failed to get poll reaction.\nError: ${Error}`);
                            }
                        }

                        Finish_Status = `${Finish_Status}${Winner.Reaction} won the [poll](${Poll_Message.url}) with **${Winner.Count}** votes or **${Math.floor((Winner.Count / Total_Vote_Count) * 100)}%** of the total votes!`;

                        Message.channel.send({
                            embeds: [Finish_Embed(Title, Duration, Finish_Status, Message.author.tag)],
                        });
                    } else {
                        let Finish_Status = Description != "" ? `${Discription}\n\nWe have a tie between ` : "We have a tie between";
                        let Ties = [];

                        for (let Option = 0; Options.length > Option; Option++) {
                            try {
                                let Reaction = Reactions.get(Option_Emojis[Option]);

                                if (Reaction) {
                                    if (Reaction.count === Winner.Count) {
                                        Ties.push(Option_Emojis[Option]);
                                    }
                                }
                            } catch (Error) {
                                console.log(`Failed to get poll reaction.\nError: ${Error}`);
                            }
                        }

                        for (let Tie = 0; Ties.length > Tie; Tie++) {
                            if (Tie === 0) {
                                Finish_Status = `${Finish_Status}${Ties[Tie]}`;
                            } else if (Tie === Ties.length - 1) {
                                Finish_Status = `${Finish_Status} and ${Ties[Tie]}`;
                            } else {
                                Finish_Status = `${Finish_Status}, ${Ties[Tie]}`;
                            }
                        }

                        Finish_Status = `${Finish_Status}.`;

                        Message.channel.send({
                            embeds: [Finish_Embed(Title, Duration, Finish_Status, Message.author.tag)],
                        });
                    }
                }, 1000 * Duration);
            });

        const Log_Channel = Get_Server_Log_Channel(Message.guild);

        if (Log_Channel)
            Log_Channel.send({
                embeds: [Log_Embed(Message.channel.toString(), Message.author.toString())],
            });
    },
};
