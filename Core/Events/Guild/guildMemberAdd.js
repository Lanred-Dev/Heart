const Discord = require("discord.js");
const fs = require("fs");

function Welcome_Embed(Message, Server) {
	const Embed = new Discord.MessageEmbed().setTitle(`:door: Welcome to ${Server}! :door:`).setDescription(`${Message}`).setColor("#0091FF").setFooter(`❤ ${Server}`);

	return Embed;
}

module.exports = async (Client, Member) => {
	const Role = Welcome_Database[Member.guild.id].welcome.role;
	const Message = Welcome_Database[Member.guild.id].welcome.message;
	const Channel = Welcome_Database[Member.guild.id].welcome.channel;

	if (Role) {
		const Real_Role = Member.guild.roles.cache.find((Gotten_Role) => {
			return Gotten_Role.name.toLowerCase() === Role.toLowerCase();
		});

		Member.roles.add(Real_Role).catch((Error) => {
			console.log(`Failed to add role to new member.\nError: ${Error}`);
		});
	}

	if (Message && Channel) {
		const Real_Channel = Member.guild.channels.cache.find((Gotten_Channel) => {
			return Gotten_Channel.name.toLowerCase() === Channel.toLowerCase();
		});

		if (!Real_Channel) return;

		const MemberCount_Replace = Message.replace(/{MemberCount}/g, `${Member.guild.memberCount}`);
		const ServerName_Replace = MemberCount_Replace.replace(/{ServerName}/g, `${Member.guild.name}`);
		const Real_Message = ServerName_Replace.replace(/{User}/g, `${Member.user}`);

		Real_Channel.send(Welcome_Embed(Real_Message, Member.guild.name));
	}
};
