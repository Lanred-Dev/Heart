const Discord = require("discord.js");
const Webhook_Client = new Discord.WebhookClient({ id: process.env.SUGGESTION_LINK_ID, token: process.env.SUGGESTION_LINK_TOKEN });
const Bot_Admins = process.env.BOT_ADMINS.split(",");
const Moderation_Database = Global_Databases.Moderation;

function Feedback_Embed(Feedback, User) {
    const Embed = new Discord.MessageEmbed()
        .setTitle("Feedback")
        .setDescription(Feedback)
        .addFields({
            name: "User",
            value: User,
            inline: true,
        })
        .setColor(Global_Embed_Color);

    return Embed;
}

function Announcement_Embed(Title, Description, Footer) {
    const Embed = new Discord.MessageEmbed()
        .setTitle(Title)
        .setDescription(Description)
        .setFooter(Footer)
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = async (_, Client, Socket_Server) => {
    Socket_Server.on("connection", (Socket) => {
        const User = Socket.request.user;

        if (!User) return Socket.disconnect();

        Socket.on("Admin/Post_Announcement", (Data) => {
            if (!User && !Bot_Admins.find((Gotten_User) => Gotten_User === User.id)) return Socket.emit("Alerts/401");

            const Title = Data.Title;
            const Description = Data.Description;
            const Footer = Data.Footer;
            const Website_Description = Data.Website_Description;

            if (((!Title || !Footer) && (!Description || Description === "" || Description.length <= 0)) && ((!Description || !Footer) && (!Title || Title === "" || Title.length <= 0)) && ((!Description || !Title) && (!Footer || Footer === "" || Footer.length <= 0))) return Socket.emit("Alerts/0", "Empty Field");

            Client.guilds.cache
                .filter((Guild) => Moderation_Database[Guild.id] && Moderation_Database[Guild.id].system_messages.enabled === true && Moderation_Database[Guild.id].system_messages.channel)
                .forEach((Guild) => {
                    try {
                        const Channel = Guild.channels.cache
                            .filter((Gotten_Channel) => Gotten_Channel.deleted === false && Gotten_Channel.type === "GUILD_TEXT")
                            .find((Gotten_Channel) => {
                                return Gotten_Channel.name === Moderation_Database[Guild.id].system_messages.channel;
                            });

                        if (!Channel) return;

                        const Has_Permissions = Channel.permissionsFor(Client.user).has([Discord.Permissions.FLAGS["SEND_MESSAGES"]]);

                        if (!Has_Permissions) return;

                        Channel.send({embeds: [Announcement_Embed(Title, Description, Footer)]});
                    } catch (Error) {
                        console.log(`Failed to send bot announcement.\nError: ${Error}`);
                    }
                });
        });

        Socket.on("Core/Send_Feedback", async (Data) => {
            if (!User) return Socket.emit("Alerts/401");

            await Webhook_Client.send("Feedback", {
                username: "Feedback",
                content: "",
                embeds: [Feedback_Embed(Feedback, Description.member.user.tag.toString())],
            });
        });
    });
};
