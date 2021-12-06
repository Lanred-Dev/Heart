const Discord = require("discord.js");
const fs = require("fs");
const Prefix = process.env.PREFIX;
const Level_System_Cooldown = new Map();
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Currency_Disabled_Ambulance_Embed = Global_Functions.Currency_Disabled_Ambulance_Embed;
const Format_Time = Global_Functions.Format_Time;
const Cooldown_Embed = Global_Functions.Cooldown_Embed;
const Error_Embed = Global_Functions.Error_Embed;
const Moderation_Database = Global_Databases.Moderation;
const User_Database = Global_Databases.Users;
const Guild_Constructor = require("../../../Core/utils/Data/Constructors/Guild.js");
const User_Constructor = require("../../../Core/utils/Data/Constructors/User.js");

function Command_Disabled_Embed(Status) {
    const Embed = new Discord.MessageEmbed().setTitle(":lock: [Lock noises] :lock:").setDescription(Status).setColor(Global_Embed_Color);

    return Embed;
}

function Check_If_Can_Use(Member, Needed_Permissions) {
    let Found = false;

    if (Needed_Permissions === null || Needed_Permissions === "" || Needed_Permissions === []) {
        return true;
    }

    if (Array.isArray(Needed_Permissions)) {
        Needed_Permissions.forEach((Permission) => {
            if (Member.permissions.has(Discord.Permissions.FLAGS[Permission])) {
                Found === true;

                return true;
            }
        });
    } else {
        if (Member.permissions.has(Discord.Permissions.FLAGS[Needed_Permissions])) return true;
    }

    if (Found) return;

    return false;
}

function Check_Valid_Character(Character) {
    return Character.toLowerCase() != Character.toUpperCase();
}

module.exports = async (Client, Message) => {
    const Has_Channel_Permissions = Message.channel.permissionsFor(Client.user).has("SEND_MESSAGES");

    if (Message.author.bot || !Message.guild || Message.webhookId || Message.type === "REPLY" || !Has_Channel_Permissions) return;

    let Is_Command = true;

    if (Message.mentions.has(Client.user) && Message.content.toLowerCase().includes("help")) {
        Client.Commands.get("help").execute(Message, [], Client, "help");

        return;
    }

    if (!Message.content.startsWith(Prefix) || !Check_Valid_Character(Message.content.charAt(1))) Is_Command = false;

    try {
        if (Is_Command === true) {
            try {
                const Args = Message.content.slice(Prefix.length).split(/ +/);
                const Command = Args.shift().toLowerCase();

                if (!Command) return;

                if (!Moderation_Database[Message.guild.id]) Moderation_Database[Message.guild.id] = Guild_Constructor;
                if (!User_Database[Message.author.id]) {
                    User_Database[Message.author.id] = User_Constructor;
                } else {
                    User_Database[Message.author.id].bank = Math.floor(User_Database[Message.author.id].bank);
                    User_Database[Message.author.id].wallet = Math.floor(User_Database[Message.author.id].wallet);
                }

                const File = Client.Commands.get(Command) || Client.Commands.find((Aliase) => Aliase.aliases && Aliase.aliases.includes(Command));

                if (!File)
                    return Message.channel.send({
                        embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find a command called **${Command}**.`, `For a list of commands do ${Prefix}help`)],
                    });

                if (Moderation_Database[Message.guild.id].disabled_commands.includes(File.name) && !Message.member.permissions.has(Discord.Permissions.FLAGS["ADMINISTRATOR"])) {
                    Message.channel.send({
                        embeds: [Command_Disabled_Embed(`${Message.author.toString()}, **${Command}** is disabled.`)],
                    });

                    return;
                } else if (Moderation_Database[Message.guild.id].disabled_commands.includes(File.name) && Message.member.permissions.has(Discord.Permissions.FLAGS["ADMINISTRATOR"])) {
                    Message.channel.send(`**${Command}** is disabled for people without **administrator** permissions`);
                }

                if (Moderation_Database[Message.guild.id].currency_system === false && File.category === "currency")
                    return Message.channel.send({
                        embeds: [Currency_Disabled_Ambulance_Embed()],
                    });

                if (Client.Commands_Info.Cooldowns[File.name] && Client.Commands_Info.Cooldowns[File.name].has(Message.author.id))
                    return Message.channel.send({
                        embeds: [Cooldown_Embed(`${Message.author.toString()}, calm down there! **${Command}** is on cooldown(${Format_Time(File.cooldown)} remaining).`)],
                    });

                if (Client.Commands_Info.Role_Permissions[File.name] && Check_If_Can_Use(Message.member, Client.Commands_Info.Role_Permissions[File.name]) != true)
                    return Message.channel.send({
                        embeds: [Ambulance_Embed(`${Message.author.toString()}, you cant use **${Command}**.`)],
                    });

                File.execute(Message, Args, Client, Command);

                if (Client.Commands_Info.Cooldowns[File.name]) {
                    Client.Commands_Info.Cooldowns[File.name].add(Message.author.id);
                    setTimeout(function () {
                        Client.Commands_Info.Cooldowns[File.name].delete(Message.author.id);
                    }, File.cooldown);
                }
            } catch (Error) {
                console.log(`Failed to handle command.\nError: ${Error}`);

                Message.channel.send({
                    embeds: [Error_Embed(Error)],
                });
            }
        } else if (Moderation_Database[Message.guild.id] && Moderation_Database[Message.guild.id].level_system.enabled === true) {
            if (!User_Database.Levels[Message.guild.id]) User_Database.Levels[Message.guild.id] = {};
            if (!User_Database.Levels[Message.guild.id][Message.author.id])
                User_Database.Levels[Message.guild.id][Message.author.id] = {
                    messages: 0,
                    level: 0,
                    xp: 0,
                };

            if (!Level_System_Cooldown.get(Message.guild.id)) Level_System_Cooldown.set(Message.guild.id, new Map());

            if (!Level_System_Cooldown.get(Message.guild.id).has(Message.author.id) && Message.content.length > 2) {
                User_Database.Levels[Message.guild.id][Message.author.id].messages += 1;
                User_Database.Levels[Message.guild.id][Message.author.id].xp += Math.floor(Math.random() * 7) + 1 * Moderation_Database.Level_System[Message.guild.id].multiplier;

                if (User_Database.Levels[Message.guild.id][Message.author.id].xp > Levels_Reach[User_Database.Levels[Message.guild.id][Message.author.id].level + 1]) {
                    User_Database.Levels[Message.guild.id][Message.author.id].level += 1;

                    Message.channel.send({
                        embeds: [new Discord.MessageEmbed().setTitle(":partying_face: [EPIC PARTY NOISES] :partying_face:").setDescription(`${Message.author.toString()}, congrats you are now level **${User_Database.Levels[Message.guild.id][Message.author.id].level}**!`).setColor(Global_Embed_Color)],
                    });
                }

                Level_System_Cooldown.get(Message.guild.id).set(Message.author.id);
                setTimeout(function () {
                    Level_System_Cooldown.get(Message.guild.id).delete(Message.author.id);
                }, 2000);
            }
        }
    } finally {
        fs.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 0));
        fs.writeFileSync("Core/Databases/Users-Database.json", JSON.stringify(User_Database, null, 0));
    }
};
