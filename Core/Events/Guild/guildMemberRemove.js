const DiscordAPI = require("discord.js");
const fsAPI = require("fs");

function Leave_Embed(Message, Server, User_Tag) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(`:door: So long, ${User_Tag}. :door:`)
        .setDescription(`${Message}`)
        .setColor("#0091FF")
        .setFooter(`❤ ${Server}`);

    return Embed;
};

module.exports = async (Client, Member) => {
    return;

    if (!Welcome_Database[Member.guild.id]) Welcome_Database[Member.guild.id] = {
        welcome: {
            role: null,
            channel: null,
            message: null
        },
        leave: {
            channel: null,
            message: null
        }
    }, fsAPI.writeFileSync("Core/Databases/Welcome-Database.json", JSON.stringify(Welcome_Database, null, 2));

    const User = Member.user;

    const Message = Welcome_Database[Member.guild.id].leave.message;
    const Channel = Welcome_Database[Member.guild.id].leave.channel;

    if (Message && Channel) {
        const Real_Channel = Member.guild.channels.cache.find((Gotten_Channel) => {
            return Gotten_Channel.name.toLowerCase() === Channel.toLowerCase();
        });

        if (!Real_Channel) return;

        const MemberCount_Replace = Message.replace(/{MemberCount}/g, `${Member.guild.memberCount}`);
        const ServerName_Replace = MemberCount_Replace.replace(/{ServerName}/g, `${Member.guild.name}`);
        const Real_Message = ServerName_Replace.replace(/{User}/g, `${User}`);

        Real_Channel.send(Leave_Embed(Real_Message, Member.guild.name, User.tag));
    };
};