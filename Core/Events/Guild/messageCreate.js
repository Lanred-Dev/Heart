const DiscordAPI = require("discord.js");
const fsAPI = require("fs");
const Prefix = process.env.PREFIX;
const Level_System_Cooldown = new Map();
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Currency_Disabled_Ambulance_Embed = Global_Functions.Currency_Disabled_Ambulance_Embed;
const Format_Time = Global_Functions.Format_Time;
const Cooldown_Embed = Global_Functions.Cooldown_Embed;

function Command_Disabled_Embed(Status) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":lock: [Lock noises] :lock:")
        .setDescription(Status)
        .setColor(Global_Embed_Color)

    return Embed;
}

function Check_If_Can_Use(Member, Needed_Permissions) {
    var Found = false;

    if (Needed_Permissions === null || Needed_Permissions === "" || Needed_Permissions === []) {
        return true;
    }

    if (Array.isArray(Needed_Permissions) === true) {
        Needed_Permissions.forEach(Permission => {
            if (Member.permissions.has(DiscordAPI.Permissions.FLAGS[Permission])) {
                Found === true;

                return true;
            }
        });
    } else {
        if (Member.permissions.has(DiscordAPI.Permissions.FLAGS[Needed_Permissions])) return true;
    }

    if (Found === true) return;

    return false;
}

function Check_Valid_Character(Character) {
    return Character.toLowerCase() != Character.toUpperCase();
}

module.exports = async (Client, Message) => {
    if (Message.author.bot || !Message.guild || Message.webhookId || Message.type === "REPLY") return;

    var Is_Command = true;

    if (!Message.content.startsWith(Prefix) || !Check_Valid_Character(Message.content.charAt(1))) Is_Command = false;

    if (!Moderation_Database[Message.guild.id]) Moderation_Database[Message.guild.id] = {
        log_channel: null,
        warns: {},
        appeal_statement: "None",
        bot_updates: {
            enabled: false,
            channel: null
        },
        currency_system: false,
        level_system: {
            enabled: false,
            multiplier: 1
        },
        disabled_commands: []
    };
    if (!Users_Database.Currency[Message.author.id]) {
        Users_Database.Currency[Message.author.id] = {
            bank: 0,
            wallet: 0,
            job: null,
            hours_worked: 0,
            rob_points: 0,
            inventory: []
        };
    } else {
        Users_Database.Currency[Message.author.id].bank = Math.floor(Users_Database.Currency[Message.author.id].bank);
        Users_Database.Currency[Message.author.id].wallet = Math.floor(Users_Database.Currency[Message.author.id].wallet);
    };

    if (Is_Command === true) {
        const Args = Message.content.slice(Prefix.length).split(/ +/);
        const Command = Args.shift().toLowerCase();

        if (!Command) return;

        const File = Client.Commands.get(Command) || Client.Commands.find(Aliase => Aliase.aliases && Aliase.aliases.includes(Command));

        if (!File) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, there is no **${Command}** command.`, `For a list of commands do ${Prefix}help`)]
        })

        if (Moderation_Database[Message.guild.id].disabled_commands.includes(File.name) && !Message.member.permissions.has(DiscordAPI.Permissions.FLAGS["ADMINISTRATOR"])) {
            Message.channel.send({
                embeds: [Command_Disabled_Embed(`${Message.author.toString()}, **${Command}** is disabled.`)]
            });

            return;
        } else if (Moderation_Database[Message.guild.id].disabled_commands.includes(File.name) && Message.member.permissions.has(DiscordAPI.Permissions.FLAGS["ADMINISTRATOR"])) {
            Message.channel.send(`**${Command}** is disabled for people without **administrator** permissions`);
        }

        if (Moderation_Database[Message.guild.id].currency_system === false && File.category === "currency") return Message.channel.send({
            embeds: [Currency_Disabled_Ambulance_Embed()]
        });

        if (Commands_Info.Cooldowns[File.name] && Commands_Info.Cooldowns[File.name].has(Message.author.id)) return Message.channel.send({
            embeds: [Cooldown_Embed(`${Message.author.toString()}, you can only use the **${Command}** command every ${Format_Time(File.cooldown)}.`)]
        });

        if (Commands_Info.Role_Permissions[File.name] && Check_If_Can_Use(Message.member, Commands_Info.Role_Permissions[File.name]) != true) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, you cant use **${Command}**.`)]
        });

        await File.execute(Message, Args, Client, Command);

        if (Commands_Info.Cooldowns[File.name]) {
            Commands_Info.Cooldowns[File.name].add(Message.author.id);
            setTimeout(function () {
                Commands_Info.Cooldowns[File.name].delete(Message.author.id);
            }, File.cooldown);
        }
    } else if (Moderation_Database[Message.guild.id].level_system.enabled === true) {
        if (!Users_Database.Levels[Message.guild.id]) Users_Database.Levels[Message.guild.id] = {};
        if (!Users_Database.Levels[Message.guild.id][Message.author.id]) Users_Database.Levels[Message.guild.id][Message.author.id] = {
            messages: 0,
            level: 0,
            xp: 0
        };

        if (!Level_System_Cooldown.get(Message.guild.id)) Level_System_Cooldown.set(Message.guild.id, new Map());

        if (!Level_System_Cooldown.get(Message.guild.id).has(Message.author.id) && Message.content.length > 2) {
            Users_Database.Levels[Message.guild.id][Message.author.id].messages += 1;
            Users_Database.Levels[Message.guild.id][Message.author.id].xp += Math.floor(Math.random() * 7) + 1 * Moderation_Database.Level_System[Message.guild.id].multiplier;

            if (Users_Database.Levels[Message.guild.id][Message.author.id].xp > Levels_Reach[Users_Database.Levels[Message.guild.id][Message.author.id].level + 1]) {
                Users_Database.Levels[Message.guild.id][Message.author.id].level += 1;

                Message.channel.send({
                    embeds: [
                        new DiscordAPI.MessageEmbed()
                        .setTitle(":partying_face: [EPIC PARTY NOISES] :partying_face:")
                        .setDescription(`${Message.author.toString()}, congrats you are now level **${Users_Database.Levels[Message.guild.id][Message.author.id].level}**!`)
                        .setColor(Global_Embed_Color)
                    ]
                });
            }

            Level_System_Cooldown.get(Message.guild.id).set(Message.author.id);
            setTimeout(function () {
                Level_System_Cooldown.get(Message.guild.id).delete(Message.author.id);
            }, 2000);
        }
    };

    fsAPI.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 0));
    fsAPI.writeFileSync("Core/Databases/Users-Database.json", JSON.stringify(Users_Database, null, 0));
};