const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Sections = ["utility", "fun", "love", "meme", "moderation", "currency", "all"];
const Section_Emojis = {
    utility: ":gear:",
    fun: ":smile:",
    love: ":heart:",
    meme: ":rofl:",
    moderation: "🛡️",
    currency: ":coin:",
    all: "",
};
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Moderation_Database = Global_Databases.Moderation;

function Help_Embed() {
    const Embed = new Discord.MessageEmbed()
        .setTitle("🏫 [School Bell] 🏫")
        .setColor(Global_Embed_Color)
        .addFields(
            {
                name: "🛡️ Moderation 🛡️",
                value: "`help ​category: moderation`",
                inline: true,
            },
            {
                name: ":smile: Fun :smile:",
                value: "`help ​category: fun`",
                inline: true,
            },
            {
                name: ":heart: Love :heart:",
                value: "`help ​category: love`",
                inline: true,
            },
            {
                name: ":rofl: Meme :rofl:",
                value: "`help ​category: meme`",
                inline: true,
            },
            {
                name: ":gear: Utility :gear:",
                value: "`help ​category: utility`",
                inline: true,
            },
            {
                name: ":coin: Currency :coin:",
                value: "`help ​category: currency`",
                inline: true,
            },
            {
                name: ":headphones: Song :headphones:",
                value: "`help ​category: song`",
                inline: true,
            }
        )
        .setFooter(`❤ Categories`);

    return Embed;
}

function Section_Embed(Full_Section_Name, Commands, Command_Amount) {
    const Embed = new Discord.MessageEmbed().setTitle(Full_Section_Name).setDescription(Commands).setColor(Global_Embed_Color).setFooter(`❤ ${Command_Amount} comamnds`);

    return Embed;
}

function Command_Embed(Command, Description) {
    const Embed = new Discord.MessageEmbed().setTitle(Command).setDescription(Description).setColor(Global_Embed_Color);

    return Embed;
}

function Load_Section_Commands(Category, Client) {
    let String = null;
    let Command_Amount = 0;

    if (Category === "all") {
        Client.Commands_Main.forEach((File) => {
            Command_Amount++;
            String = `${String != null ? `${String}, ` : ""} \`${File.info.name}\``;
        });
    } else {
        Client.Commands_Main.filter((File) => File.category && File.category === Category).forEach((File) => {
            Command_Amount++;
            String = `${String != null ? `${String}, ` : ""} \`${File.info.name}\``;
        });
    }

    return [String, Command_Amount];
}

function Load_Command(File, Guild) {
    return `${Guild.disabled_commands.includes(File.info.name) ? "<:Locked:916713909468160020>" : ""} ${File.info.description}${File.permissions ? `\n\n**Permissions**: ${(Array.isArray(File.permissions) ? File.permissions.join(", ") : File.permissions).toLowerCase()}\n` : ""}${File.usage ? (File.permissions ? "\n" : "\n\n") + `**Usage**: ${File.usage}}` : ""}`;
}

module.exports = {
    info: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists the requested section/command detials.")
        .addStringOption((Option) => Option.setName("category").setDescription("The command category").setRequired(false))
        .addStringOption((Option) => Option.setName("command").setDescription("The command").setRequired(false)),
    category: "utility",

    async execute(Interaction, Client) {
        const Section = Interaction.options.getString("category") ? Interaction.options.getString("category").toLowerCase() : null;
        const Command = Interaction.options.getString("command") ? Interaction.options.getString("command").toLowerCase() : null;
        let Is_Command = false;

        if (Command) {
            Client.Commands_Main.forEach((File) => {
                if (File.info.name === Command) {
                    const Command_Detials = Load_Command(File, Moderation_Database[Interaction.guild.id]);

                    Is_Command = true;
                    Interaction.reply({ embeds: [Command_Embed(File.info.name, Command_Detials)] });

                    return;
                }
            });

            if (Is_Command != true) return Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, I could not find command called **${Command}**.`)] });
        }

        if (Is_Command === true) return;

        if (Sections.includes(Section)) {
            const Section_Emoji = Section_Emojis[Section];
            const Section_Info = Load_Section_Commands(Section, Client);

            Interaction.reply({ embeds: [Section_Embed(`${Section_Emoji} ${Section.toLowerCase() === "all" ? "" : Section.toLowerCase()} ${Section_Emoji}`, Section_Info[0], Section_Info[1])] });
        } else if (Section === null) {
            Interaction.reply({ embeds: [Help_Embed()] });
        } else {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, I could not find command category called **${Section}**.`)] });
        }
    },
};
