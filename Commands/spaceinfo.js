const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const Info = {
    Last_Updated: new Date(),
    ISS_Latitude: "",
    ISS_Longitude: "",
    People_In_Space: "",
    People_Names: [],
    Failed: true,
};
const Error_Embed = Global_Functions.Error_Embed;

function Embed() {
    const Last_Update = Math.floor(Math.abs(Math.round((Info.Last_Updated.getTime() - new Date().getTime()) / 1000) / 60));
    const Embed = new Discord.MessageEmbed()
        .setTitle(":rocket: Space Station Info :rocket:")
        .addFields(
            {
                name: "ISS Latitude",
                value: Info.ISS_Latitude,
                inline: true,
            },
            {
                name: "ISS Longitude",
                value: Info.ISS_Longitude,
                inline: true,
            },
            {
                name: `People In Space (${Info.People_In_Space})`,
                value: Info.People_Names,
                inline: false,
            }
        )
        .setFooter(`❤ Info provided by https://tylermwise.com • Last updated ${Last_Update > 0 ? Last_Update + (Last_Update <= 1 ? " minute ago" : " minutes ago") : "now"}`)
        .setColor(Global_Embed_Color);

    return Embed;
}

async function Update_Info() {
    try {
        const Response = await fetch("https://api.tylermwise.com/spacedata");
        const JSON_Response = await Response.json();

        Info.Failed = false;
        Info.Last_Updated = new Date();
        Info.ISS_Latitude = JSON_Response.iss_latitude;
        Info.ISS_Longitude = JSON_Response.iss_longitude;
        Info.People_In_Space = JSON_Response.people_in_space.toString();
        Info.People_Names = JSON_Response.people_names.join(", ");
    } catch (Error) {
        console.log(`Failed to fetch space data.\nError: ${Error}`);

        Info.Failed = true;
    }

    setTimeout(function () {
        Update_Info();
    }, 300000);
}

Update_Info();

module.exports = {
    info: new SlashCommandBuilder().setName("spaceinfo").setDescription("WOW! SPACE! Elon is going there!"),
    category: "fun",

    async execute(Interaction) {
        if (Info.Failed === true) return Interaction.reply({ embeds: [Error_Embed("Failed to fetch from https://tylermwise.com/spacedata")] });

        Interaction.reply({ embeds: [Embed()] });
    },
};
