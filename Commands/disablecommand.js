const DiscordAPI = require("discord.js");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Get_Toggle_Type = Global_Functions.Get_Toggle_Type;
const Get_Server_Log_Channel = Global_Functions.Get_Server_Log_Channel;
const Permanent_Commands = [
    "disablecommand",
    "disabledcommands"
];

function Log_Embed(Command, Toggle, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🛡️ Moderator Action 🛡️")
        .setDescription(`${Moderator} has ${Toggle === true ? "disabled" : "enabled"} the **${Command}** command.`)
        .setColor(Global_Embed_Color)
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

module.exports = {
    name: "disablecommand",
    aliases: ["disablecmd", "dcommand", "dcmd"],
    category: "utility",
    setup: "toggle [Command Name] [True/False]",
    show_aliases: true,
    permissions: "ADMINISTRATOR",
    description: "Want to disable/enable a command?",

    async execute(Message, Message_Args, Client) {
        const Requested_Command = Message_Args[0] != null ? Message_Args[0].toLowerCase() : null;
        const Toggle = Get_Toggle_Type(Message, Message_Args, 1, true);

        if (!Requested_Command) return Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a command to disable.`)]
        });

        var Found_Command = false;

        Client.Commands.forEach(Command => {
            if (Command.name === Requested_Command || Command.aliases.includes(Requested_Command)) {
                Found_Command = true;

                if (Moderation_Database[Message.guild.id].disabled_commands.length > 15 && Toggle === false) return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, the max amount of disabled commands is 15.`)]
                });
                if (Moderation_Database[Message.guild.id].disabled_commands.includes(Command.name) && Toggle === false) return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, **${Requested_Command}** has already been disabled.`)]
                });

                if (Command.category === "currency") {
                    Message.channel.send({
                        embeds: [Ambulance_Embed(`${Message.author.toString()}, you can disable the currency system commands with **.togglecurrency false**.`)]
                    });
                    return;

                } else if (Command.name === "level") {
                    Message.channel.send({
                        embeds: [Ambulance_Embed(`${Message.author.toString()}, you can disable the level system commands with **.togglelevels false**.`)]
                    });

                    return;
                } else if (Permanent_Commands.includes(Command.name)) {
                    Message.channel.send({
                        embeds: [Ambulance_Embed(`${Message.author.toString()}, you cannot disable **${Command.name}**.`)]
                    });

                    return;
                }

                Message.channel.send({
                    embeds: [
                        new DiscordAPI.MessageEmbed()
                        .setTitle(":gear: [Gears turning] :gear:")
                        .setDescription(`**${Command.name}** has been ${Toggle === true ? "disabled" : "enabled"}.`)
                        .setColor(Global_Embed_Color)
                    ]
                });

                if (Toggle === false) {
                    const New_Array = Moderation_Database[Message.guild.id].disabled_commands.filter(function (Disabled_Command) {
                        return Disabled_Command != Requested_Command;
                    });

                    Moderation_Database[Message.guild.id].disabled_commands = New_Array;
                } else {
                    Moderation_Database[Message.guild.id].disabled_commands.push(Command.name);
                };

                const Log_Channel = Get_Server_Log_Channel(Message.guild);

                if (Log_Channel) Log_Channel.send({
                    embeds: [Log_Embed(Command.name, Toggle, Message.author.toString())]
                });

                return;
            };
        });

        if (Found_Command === true) return;

        Message.channel.send({
            embeds: [Ambulance_Embed(`${Message.author.toString()}, there is not a **${Requested_Command}** command.`)]
        });
    }
};