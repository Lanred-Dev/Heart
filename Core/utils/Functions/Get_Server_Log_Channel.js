module.exports = {
	name: "Get_Server_Log_Channel",

	execute(Guild) {
		const Channel_Name = Global_Databases.Moderation[Guild.id].log_channel || null;

		if (!Channel_Name) return null;

		const Real_Channel = Guild.channels.cache.find((Gotten_Channel) => {
			return Gotten_Channel.name.toLowerCase() === Channel_Name.toLowerCase();
		});

		if (!Real_Channel) return null;

		return Real_Channel;
	},
};
