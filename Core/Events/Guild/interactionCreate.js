const Discord = require("discord.js");
const fs = require("fs");
const Level_System_Cooldown = new Map();
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Currency_Disabled_Ambulance_Embed = Global_Functions.Currency_Disabled_Ambulance_Embed;
const Format_Time = Global_Functions.Format_Time;
const Cooldown_Embed = Global_Functions.Cooldown_Embed;
const Error_Embed = Global_Functions.Error_Embed;
const Moderation_Database = Global_Databases.Moderation;
const User_Database = Global_Databases.Users;
const Guild_Constructor = require("../../utils/Data/Constructors/Guild.js");
const User_Constructor = require("../../utils/Data/Constructors/User.js");

function Command_Disabled_Embed(Status) {
    const Embed = new Discord.MessageEmbed().setTitle(":lock: [Lock noises] :lock:").setDescription(Status).setColor(Global_Embed_Color);

    return Embed;
}

function Check_If_Can_Use(Member, Needed_Permissions) {
    let Found = false;

    if (Needed_Permissions === null || Needed_Permissions === "" || Needed_Permissions === []) {
        return true;
    }

    if (Array.isArray(Needed_Permissions) === true) {
        Needed_Permissions.forEach((Permission) => {
            if (Member.permissions.has(Discord.Permissions.FLAGS[Permission])) {
                Found === true;

                return true;
            }
        });
    } else {
        if (Member.permissions.has(Discord.Permissions.FLAGS[Needed_Permissions])) return true;
    }

    if (Found === true) return;

    return false;
}

module.exports = async (Client, Interaction) => {
    const Has_Channel_Permissions = Interaction.channel.permissionsFor(Client.user).has("SEND_MESSAGES");

    if (!Has_Channel_Permissions) return;

    try {
        if (!Interaction.isCommand()) return;

        const Command = Client.Commands_Main.get(Interaction.commandName);

        if (!Command) return;

        if (!Moderation_Database[Interaction.guild.id]) Moderation_Database[Interaction.guild.id] = Guild_Constructor;
        if (!User_Database[Interaction.user.id]) {
            User_Database[Interaction.user.id] = User_Constructor;
        } else {
            User_Database[Interaction.user.id].bank = Math.floor(User_Database[Interaction.user.id].bank);
            User_Database[Interaction.user.id].wallet = Math.floor(User_Database[Interaction.user.id].wallet);
        }

        if (Moderation_Database[Interaction.guild.id].disabled_commands.includes(Command.info.name) && !Interaction.member.permissions.has(Discord.Permissions.FLAGS["ADMINISTRATOR"])) return Interaction.reply({ embeds: [Command_Disabled_Embed(`<:Locked:916713909468160020> ${Interaction.user.toString()}, **${Command.info.name}** is disabled.`)], ephemeral: true });
        if (Moderation_Database[Interaction.guild.id].currency_system === false && Command.category === "currency") return Interaction.reply({ embeds: [Currency_Disabled_Ambulance_Embed()], ephemeral: true });
        if (Client.Commands_Info.Cooldowns[Command.info.name] && Client.Commands_Info.Cooldowns[Command.info.name].has(Interaction.user.id)) return Interaction.reply({ embeds: [Cooldown_Embed(`${Interaction.user.toString()}, calm down there! **${Command.info.name}** is on cooldown.`)], ephemeral: true });
        if (Client.Commands_Info.Role_Permissions[Command.info.name] && Check_If_Can_Use(Interaction.member, Client.Commands_Info.Role_Permissions[Command.info.name]) != true) return Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, you cant use **${Command.info.name}**.`)], ephemeral: true });

        Command.execute(Interaction, Client);

        if (!Client.Commands_Info.Cooldowns[Command.info.name]) return;

        Client.Commands_Info.Cooldowns[Command.info.name].add(Interaction.user.id);

        setTimeout(function () {
            Client.Commands_Info.Cooldowns[Command.info.name].delete(Interaction.user.id);
        }, Command.cooldown);
    } catch (Error) {
        console.log(`Failed to handle command.\nError: ${Error}`);

        Interaction.reply({
            embeds: [Error_Embed(Error)],
        });
    } finally {
        fs.writeFileSync("Core/Databases/Moderation-Database.json", JSON.stringify(Moderation_Database, null, 0));
        fs.writeFileSync("Core/Databases/Users-Database.json", JSON.stringify(User_Database, null, 0));
    }
};
