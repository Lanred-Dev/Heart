module.exports = {
    name: "Format_Time",

    execute(Time) {
        const Seconds = Math.floor((Time / 1000) % 60);
        const Minutes = Math.floor((Time / (1000 * 60)) % 60);
        const Hours = Math.floor((Time / (1000 * 60 * 60)) % 24);

        return `${Hours > 0 ? Hours + (Hours === 1 ? " hour, " : " hours, ") : ""}${Minutes > 0 ? Minutes + (Minutes === 1 ? " minute, " : " minutes, ") : ""}${Seconds > 1 ? `${Seconds} seconds` : "and 1 second"}`;
    }
};