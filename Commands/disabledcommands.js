const Discord = require("discord.js");

function Disabled_List_Embed(Commands) {
    const Embed = new Discord.MessageEmbed().setTitle(":lock: Disabled Commands :lock:").setDescription(Commands).setColor(Global_Embed_Color);

    return Embed;
}

function No_Disabled_Commands_Embed() {
    const Embed = new Discord.MessageEmbed().setTitle(":unlock: Disabled Commands :unlock:").setDescription("No disabled commands!").setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "disabledcommands",
    aliases: ["dcommands", "dcmds", "disabledcmds"],
    category: "utility",
    setup: "disabledcommands",
    show_aliases: true,
    description: "Will display all the disabled commands in the current server.",

    async execute(Message, Message_Args, Client) {
        let String = "";

        Global_Databases.Moderation[Message.guild.id].disabled_commands.forEach((Command) => {
            String = `${String != "" ? `${String}, ` : ""}**${Command}**`;
        });

        if (String === "") {
            Message.channel.send({ embeds: [No_Disabled_Commands_Embed()] });
        } else {
            Message.channel.send({ embeds: [Disabled_List_Embed(String)] });
        }
    },
};
