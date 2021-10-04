const DiscordAPI = require("discord.js");
const fetchAPI = require("node-fetch");
const Info = {
    Last_Updated: new Date(),
    ISS_Latitude: "",
    ISS_Longitude: "",
    People_In_Space: "",
    Failed: true
}
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Info_Embed() {
    const Last_Update = Math.floor(Math.abs(Math.round((Info.Last_Updated.getTime() - new Date().getTime()) / 1000) / 60));
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle(":rocket: Space Station Info :rocket:")
        .addFields({
            name: "Last Updated",
            value: Last_Update > 0 ? Last_Update + (Last_Update <= 1 ? " minute ago" : " minutes ago") : "now",
            inline: true
        }, {
            name: "ISS Latitude",
            value: Info.ISS_Latitude,
            inline: true
        }, {
            name: "ISS Longitude",
            value: Info.ISS_Longitude,
            inline: true
        }, {
            name: "People In Space",
            value: Info.People_In_Space,
            inline: true
        })
        .setFooter("Info provided by https://dev.tylermwise.com")
        .setColor(Global_Embed_Color);

    return Embed;
}

function Update_Info() {
    fetchAPI("https://api.tylermwise.com/spacedata?lanred=heart")
        .then(Response => Response.json())
        .then(Data => {
            Info.Failed = false;
            Info.Last_Updated = new Date();
            Info.ISS_Latitude = Data.iss_latitude;
            Info.ISS_Longitude = Data.iss_longitude;
            Info.People_In_Space = Data.people_in_space.toString();
        })
        .catch(Error => {
            Info.Failed = true;

            console.log(`Failed to fetch space data.\nError: ${Error}`);
        });

    setTimeout(function () {
        Update_Info();
    }, 300000);
}

Update_Info();

module.exports = {
    name: "spaceinfo",
    aliases: ["spacedata"],
    category: "fun",
    setup: "spaceinfo",
    show_aliases: true,
    description: "Want to see info about the **ISS** and the number of people in space? Well this is the command for you!",

    async execute(Message, Message_Args, Client) {        
        if (Info.Failed === false) {
            Message.channel.send({embeds: [Info_Embed()]});
        } else {
            Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, I failed to fetch the space data. Please try again later.`)]});
        };
    }
};