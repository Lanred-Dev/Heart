const Ambulance_Embed = require("../Ambulance_Embed_Self.js");
const Toggles = {
	yes: true,
	no: false,
	true: true,
	false: false,
};

module.exports = {
	name: "Get_Toggle_Type",

	execute(Message, Message_Args, Args_Index, Ignore_Null) {
		const Toggle = Message_Args[Args_Index] ? Message_Args[Args_Index].toLowerCase() : Ignore_Null === true ? false : null;

		if (Toggle === null) {
			Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a toggle type.`)] });

			return null;
		}

		if (Toggles[Toggle]) {
			return Toggles[Toggle];
		} else {
			Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a toggle type.`)] });

			return null;
		}
	},
};
