module.exports = {
	name: "Format_Time",

	execute(Time) {
		const Seconds = Math.floor((Time / 1000) % 60);
		const Minutes = Math.floor((Time / (1000 * 60)) % 60);
		const Hours = Math.floor((Time / (1000 * 60 * 60)) % 24);

		return `${Hours > 0 ? Hours + (Hours === 1 ? " hour, " : Minutes > 0 ? " hours, " : "hours ") : ""}${Minutes > 0 ? `${Minutes + (Minutes === 1 ? " minute" : " minutes") + (Hours > 0 ? ", " : " ")}` : ""}${(Hours > 0 || Minutes > 0 ? "and " : "") + (Seconds > 1 ? `${Seconds} seconds` : "1 second")}`;
	},
};
