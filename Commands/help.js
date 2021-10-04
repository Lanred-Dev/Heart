const DiscordAPI = require("discord.js");
const Prefix = process.env.PREFIX;
const Sections = [
    "utility",
    "fun",
    "love",
    "meme",
    "moderation",
    "currency",
    "all"
];
const Section_Emojis = {
    "utility": ":gear:",
    "fun": ":smile:",
    "love": ":heart:",
    "meme": ":rofl:",
    "moderation": "🛡️",
    "currency": ":coin:",
    "all": "",
};
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Help_Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🏫 [School Bell] 🏫")
        .setColor(Global_Embed_Color)
        .addFields({
            name: "🛡️ Moderation 🛡️",
            value: `\`${Prefix}help moderation\``,
            inline: true
        }, {
            name: ":smile: Fun :smile:",
            value: `\`${Prefix}help fun\``,
            inline: true
        }, {
            name: ":heart: Love :heart:",
            value: `\`${Prefix}help love\``,
            inline: true
        }, {
            name: ":rofl: Meme :rofl:",
            value: `\`${Prefix}help meme\``,
            inline: true
        }, {
            name: ":gear: Utility :gear:",
            value: `\`${Prefix}help utility\``,
            inline: true
        }, {
            name: ":coin: Currency :coin:",
            value: `\`${Prefix}help currency\``,
            inline: true
        })
        .setFooter("❤ Categories • More commands coming soon");

    return Embed;
}

function Section_Embed(Full_Section_Name, Commands, Command_Amount) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Full_Section_Name)
        .setDescription(Commands)
        .setColor(Global_Embed_Color)
        .setFooter(`❤ ${Command_Amount} comamnds`);

    return Embed;
}

function Command_Embed(Command, Description) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(Command)
        .setDescription(Description)
        .setColor(Global_Embed_Color);

    return Embed;
}

function Load_Section_Commands(Section, Client) {
    var String = "";
    var First_Command = true;
    var Command_Amount = 0;

    if (Section === "all") {
        Client.Commands.forEach(File => {
            if (File.category) {
                Command_Amount++;

                if (First_Command) {
                    String = `\`${Prefix + File.name}\``, First_Command = false;
                } else {
                    String = `${String}, \`${Prefix + File.name}\``;
                };
            };
        });
    } else {
        Client.Commands.forEach(File => {
            if (File.category && File.category === Section) {
                Command_Amount++;

                if (First_Command) {
                    String = `\`${Prefix + File.name}\``, First_Command = false;
                } else {
                    String = `${String}, \`${Prefix + File.name}\``;
                };
            };
        });
    };

    return [String, Command_Amount];
}

function Load_Command(File) {
    var String = `${File.description}\n\nSetup: \`${Prefix + File.setup}\``;
    var First_Secondary = true;
    var First_Aliase = true;

    if (File.show_aliases != false) {
        if (File.aliases.length != 0) {
            String = `${String}\nAliases: `;

            File.aliases.forEach(Aliase => {
                if (First_Aliase) {
                    String = `${String}\`${Prefix + Aliase}\``, First_Aliase = false;
                } else {
                    String = `${String}, \`${Prefix + Aliase}\``;
                };
            });
        }
    }

    if (File.secondary) {
        String = `${String}\nCommands: `;

        File.secondary.forEach(Secondary => {
            if (First_Secondary) {
                String = `${String}\`${Prefix + Secondary}\``, First_Secondary = false;
            } else {
                String = `${String}, \`${Prefix + Secondary}\``;
            };
        });
    };

    return String;
}

module.exports = {
    name: "help",
    aliases: ["commands", "cmds"],
    category: "utility",
    setup: "help [Category/Command]",
    show_aliases: true,
    description: "Lists the requested section/command detials.",

    async execute(Message, Message_Args, Client, Command) {
        const Help = Message_Args.slice(0).join(" ").toLowerCase();
        var Command = false;

        if (!Help) return Message.channel.send({embeds: [Help_Embed()]});

        Client.Commands.forEach(File => {
            if (File.name === Help || File.aliases.includes(Help)) {
                const Command_Detials = Load_Command(File);

                Message.channel.send({embeds: [Command_Embed(File.name, Command_Detials)]});
                Command = true;

                return;
            };
        });

        if (Command === true) return;

        if (Sections.includes(Help)) {
            const Section_Emoji = Section_Emojis[Help];
            const Section_Info = Load_Section_Commands(Help, Client);

            Message.channel.send({embeds: [Section_Embed(`${Section_Emoji} ${Help.toLowerCase() === "all" ? "" : Help.toLowerCase()} ${Section_Emoji}`, Section_Info[0], Section_Info[1])]});
        } else {
            Message.channel.send({embeds: [Ambulance_Embed(`I cant find category **${Help}** called.`)]});
        };
    }
};