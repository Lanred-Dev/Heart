//dont upgrade any of this. Its old and is being replaced

const DiscordAPI = require("discord.js");
const fsAPI = require("fs");
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Welcome_Role_Add_Embed(Role, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the welcome role.")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Role",
            value: Role,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
};

function Welcome_Message_Add_Embed(Message, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the welcome message.")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Message",
            value: Message,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
};

function Welcome_Channel_Add_Embed(Channel, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the welcome channel.")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Channel",
            value: Channel,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

function Welcome_Embed_Preview(Message, Server) {
    const MemberCount_Replace = Message.replace(/{MemberCount}/g, `${Server.memberCount}`);
    const ServerName_Replace = MemberCount_Replace.replace(/{ServerName}/g, `${Server.name}`);
    const Real_Message = ServerName_Replace.replace(/{User}/g, `@NewUser`);

    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(`:door: Welcome to ${Server}! [Preview] :door:`)
        .setDescription(Real_Message)
        .setColor("#FF2D00")
        .setFooter(`❤ ${Server}`);

    return Embed;
}

function Leave_Message_Add_Embed(Message, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the leave message!")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Message",
            value: Message,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

function Leave_Channel_Add_Embed(Channel, Moderator) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":gear: [Gears turning] :gear:")
        .setDescription("I have added/updated the leave channel!")
        .setColor("#255f85")
        .addFields({
            name: "Moderator",
            value: Moderator,
            inline: true
        }, {
            name: "Channel",
            value: Channel,
            inline: true
        })
        .setTimestamp(new Date())
        .setFooter("❤ Log");

    return Embed;
}

function Leave_Embed_Preview(Message, Server) {
    const MemberCount_Replace = Message.replace(/{MemberCount}/g, `${Server.memberCount}`);
    const ServerName_Replace = MemberCount_Replace.replace(/{ServerName}/g, `${Server.name}`);
    const Real_Message = ServerName_Replace.replace(/{User}/g, `@NewUser`);

    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(`:door: So long, @LeaveingUser. :door:`)
        .setDescription(Real_Message)
        .setColor("#FF2D00")
        .setTimestamp(new Date())
        .setFooter(`❤ ${Server}`);

    return Embed;
}

function Get_Title(String) {
    const Match = String.match(/{title:.*}/gim);

    if (!Match) return null;

    const Replace_1 = Match[0].replace(/{title:\s?/gim, "");

    return Replace_1.replace(/}.*/gim, "");
}

module.exports = {
    name: "welcome",
    aliases: ["welcomerole", "welcomemessage", "welcomechannel", "resetwelcome", "disablewelcome", "previewwelcome", "welcomepreview", "leavechannel", "leavemessage", , "disableleave", "resetleave", "previewleave", "leavepreview"],
    category: "utility",
    setup: "help welcome",
    show_aliases: false,
    secondary: ["welcomemessage [Message]", "welcomerole [Role Name]", "welcomechannel [Channel Name]", "leavechannel [Channel Name]", "leavemessage [Message]", "disablewelcome", "previewwelcome"],
    description: "A command to welcome new users to the server!",

    async execute(Message, Message_Args, Client, Command) {
        if (!Message.member.hasPermission("ADMINISTRATOR")) return Message.channel.send(Ambulance_Embed(`${Message.author.toString()}, you cant use that.`));

        if (Command === "welcomemessage") {
            const New_Message = Message_Args.slice(0).join(" ");

            if (!New_Message) return Message.channel.send(Ambulance_Embed("Please provide a message!"));

            Message.channel.send(new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The welcome message has been updated.")
                .setColor("#0091FF")
                .setFooter("❤"));

            const Log_Channel = Moderation_Database.Log_Channels[Message.guild.id].channel;

            if (Log_Channel) {
                const Real_Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Log_Channel.toLowerCase();
                });

                Real_Channel.send(Welcome_Message_Add_Embed(New_Message, Message.author.toString()));
            } else {
                Message.channel.send(Welcome_Message_Add_Embed(New_Message, Message.author.toString()));
            };

            Welcome_Database[Message.guild.id].welcome.message = New_Message;
            fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
        } else if (Command === "welcomerole") {
            const Role_Name = Message_Args.join(" ");

            if (!Role_Name) return Message.channel.send(Ambulance_Embed("Please provide a role!"));

            const Role = Message.guild.roles.cache.find((Gotten_Role) => {
                return Gotten_Role.name.toLowerCase() === Role_Name.toLowerCase();
            });

            if (!Role) return Message.channel.send(Ambulance_Embed("I could not find that role!")), Message.delete();

            Message.channel.send(new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The welcome role has been updated.")
                .setColor("#0091FF")
                .setFooter("❤"));

            const Log_Channel = Moderation_Database.Log_Channels[Message.guild.id].channel;

            if (Log_Channel) {
                const Real_Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Log_Channel.toLowerCase();
                });

                Real_Channel.send(Welcome_Role_Add_Embed(Role.toString(), Message.author.toString()));
            } else {
                Message.channel.send(Welcome_Role_Add_Embed(Role.toString(), Message.author.toString()));
            };

            Welcome_Database[Message.guild.id].welcome.role = Role_Name;
            fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
        } else if (Command === "welcomechannel") {
            const Channel_Name = Message_Args.join(" ");

            if (!Channel_Name) return Message.channel.send(Ambulance_Embed("Please provide a channel name!"));

            const Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                return Gotten_Channel.name.toLowerCase() === Channel_Name.toLowerCase();
            });

            if (!Channel) return Message.channel.send(Ambulance_Embed(`I could not find ${Channel_Name} as a channel!`)), Message.delete();

            Message.channel.send(new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The welcome channel has been updated.")
                .setColor("#0091FF")
                .setFooter("❤"));

            const Log_Channel = Moderation_Database.Log_Channels[Message.guild.id].channel;

            if (Log_Channel) {
                const Real_Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Log_Channel.toLowerCase();
                });

                Real_Channel.send(Welcome_Channel_Add_Embed(Channel.toString(), Message.author.toString()));
            } else {
                Message.channel.send(Welcome_Channel_Add_Embed(Channel.toString(), Message.author.toString()));
            };

            Welcome_Database[Message.guild.id].welcome.channel = Channel_Name;
            fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
        } else if (Command === "leavechannel") {
            const Channel_Name = Message_Args.join(" ");

            if (!Channel_Name) return Message.channel.send(Ambulance_Embed("Please provide a channel name!"));

            const Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                return Gotten_Channel.name.toLowerCase() === Channel_Name.toLowerCase();
            });

            if (!Channel) return Message.channel.send(Ambulance_Embed(`I could not find ${Channel_Name} as a channel!`)), Message.delete();

            Message.channel.send(new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The leave channel has been updated.")
                .setColor("#0091FF")
                .setFooter("❤"));

            const Log_Channel = Moderation_Database.Log_Channels[Message.guild.id].channel;

            if (Log_Channel) {
                const Real_Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Log_Channel.toLowerCase();
                });

                Real_Channel.send(Leave_Channel_Add_Embed(Channel.toString(), Message.author.toString()));
            } else {
                Message.channel.send(Leave_Channel_Add_Embed(Channel.toString(), Message.author.toString()));
            };

            Welcome_Database[Message.guild.id].leave.channel = Channel_Name;
            fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
        } else if (Command === "leavemessage") {
            const New_Message = Message_Args.slice(0).join(" ");

            if (!New_Message) return Message.channel.send(Ambulance_Embed("Please provide a message!"));

            Message.channel.send(new DiscordAPI.MessageEmbed()
                .setTitle(":gear: [Gears turning] :gear:")
                .setDescription("The leave message has been updated.")
                .setColor("#0091FF")
                .setFooter("❤"));

            const Log_Channel = Moderation_Database.Log_Channels[Message.guild.id].channel;

            if (Log_Channel) {
                const Real_Channel = Message.guild.channels.cache.find((Gotten_Channel) => {
                    return Gotten_Channel.name.toLowerCase() === Log_Channel.toLowerCase();
                });

                Real_Channel.send(Leave_Message_Add_Embed(New_Message, Message.author.toString()));
            } else {
                Message.channel.send(Leave_Message_Add_Embed(New_Message, Message.author.toString()));
            };

            Welcome_Database[Message.guild.id].leave.message = New_Message;
            fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
        } else if (Command === "disablewelcome" || Command === "resetwelcome" || Command === "resetleave" || Command === "disableleave") {
            if (Command === "resetwelcome") {
                Welcome_Database[Message.guild.id].welcome = {
                    role: null,
                    channel: null,
                    message: null
                };
                fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
            } else if (Command === "disablewelcome") {
                Welcome_Database[Message.guild.id].welcome.channel = null;
                fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
            } else if (Command === "resetleave") {
                Welcome_Database[Message.guild.id].leave = {
                    channel: null,
                    message: null
                };
                fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
            } else if (Command === "disableleave") {
                Welcome_Database[Message.guild.id].leave.channel = null;
                fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));
            };
        } else if (Command === "welcomepreview" || Command === "previewwelcome") {
            var Welcome_Message = Welcome_Database[Message.guild.id].welcome.message;

            if (!Welcome_Message) Welcome_Message = "No welcome message.";

            Message.channel.send(Welcome_Embed_Preview(Welcome_Message, Message.guild.name));
        } else if (Command === "leavepreview" || Command === "leavewelcome") {
            var Leave_Message = Welcome_Database[Message.guild.id].leave.message;

            if (!Leave_Message) Leave_Message = "No leave message.";

            Message.channel.send(Leave_Embed_Preview(Leave_Message, Message.guild.name));
        } else {
            Message.channel.send(Ambulance_Embed("Invalid use of 'welcome' try `.help welcome`"));
        };
    }
};