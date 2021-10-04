const DiscordAPI = require("discord.js");
const DiscordVoiceAPI = require("@discordjs/voice");
const ytdlAPI = require("ytdl-core");
const ytSearchAPI = require("yt-search");
const Song_Queues = new Map();
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Playing_Embed(Song, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🎧 A new song is playing! 🎧")
        .setDescription(`[${Song.title}](${Song.url}) is now playing.`)
        .setColor(Global_Embed_Color)
        .setFooter(`Requested by ${User}`);

    return Embed;
}

function Queue_Add_Embed(Song, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🎧 A new song has been added! 🎧")
        .setDescription(`[${Song.title}](${Song.url}) has been added to the queue.`)
        .setColor(Global_Embed_Color)
        .setFooter(`Added by ${User}`);

    return Embed;
}

function Stop_Embed(Song, User) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🎧 [DJ Sounds] 🎧")
        .setDescription("All songs have stopped playing and the queue has been cleared.")
        .setColor(Global_Embed_Color)
        .setFooter(`Stopped by ${User}`);

    return Embed;
}

function Current_Song_Embed(Song) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🎧 [DJ Sounds] 🎧")
        .setColor(Global_Embed_Color)
        .setDescription(`The current song is [${Song.title}](${Song.url}) and was requested by ${Song.user}.`)

    return Embed;
}

function End_Embed(Song) {
    const Embed = new DiscordAPI.MessageEmbed()
        .setTitle("🎧 [DJ Sounds] 🎧")
        .setColor(Global_Embed_Color)
        .setDescription(`The current song is [${Song.title}](${Song.url}) and was requested by ${Song.user}.`)

    return Embed;
}

async function Video_Player(Guild, Song) {
    const Server_Queue = Song_Queues.get(Guild.id);

    if (!Server_Queue) return;

    if (!Song) {
        Server_Queue.Voice_Channel.leave();
        Song_Queues.delete(Guild.id);

        return;
    };

    Server_Queue.Connection.play(ytdlAPI(Song.url, {
            filter: "audioonly"
        }), {
            seek: 0,
            volume: 0.5
        })
        .on("finish", () => {
            Server_Queue.Songs.shift();
            Video_Player(Guild, Server_Queue.Songs[0]);
        });

    await Server_Queue.Channel.send(Playing_Embed(Song, Song.user));
}

module.exports = {
    name: "song",
    aliases: ["play", "stop", "skip", "currentsong", "queue", "volume"],
    category: "music",
    show_aliases: false,
    setup: "help song",
    secondary: ["play [Song]", "skip", "stop", "currentsong", "volume [Amount]", "clearqueue"],
    description: "Want to listen to some audio in a vc, otherwise known as a voice call? Well this is the command!",

    async execute(Message, Message_Args, Client, Command) {
        const Voice_Channel = Message.member.voice.channel;

        if (!Voice_Channel) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, you have to be in a voice channel.`)]});

        const Permissions = Voice_Channel.permissionsFor(Message.client.user);

        if (!Permissions.has(DiscordAPI.Permissions.FLAGS["SPEAK"])) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, you dont have permission to speak there.`)]});

        const Server_Queue = Song_Queues.get(Message.guild.id);

        if (Command === "play") {
            const Requested_Audio = Message_Args.join(" ");

            if (!Requested_Audio) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a song.`)]});

            var Song = {};

            if (ytdlAPI.validateURL(Requested_Audio)) {
                const Song_Info = await ytdlAPI.getInfo(Requested_Audio);

                Song = {
                    title: Song_Info.videoDetails.title,
                    url: Song_Info.videoDetails.video_url,
                    thumbnail: Song_Info.videoDetails.thumbnail,
                    user: Message.author.tag
                };
            } else {
                const Video_Finder = async (Query) => {
                    const Video_Result = await ytSearchAPI(Query);

                    return Video_Result.videos.length >= 1 ? Video_Result.videos[0] : null;
                };

                const Video = await Video_Finder(Requested_Audio);

                if (!Video) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, I could not find any song named ${Requested_Audio}.`)]});

                Song = {
                    title: Video.title,
                    url: Video.url,
                    thumbnail: Video.thumbnail,
                    user: Message.author.tag
                };
            };

            if (!Server_Queue) {
                const Queue_Constructor = {
                    Voice_Channel: Voice_Channel,
                    Channel: Message.channel,
                    Connection: null,
                    Songs: []
                };

                Song_Queues.set(Message.guild.id, Queue_Constructor);
                Queue_Constructor.Songs.push(Song);

                try {
                    const Connection = await DiscordVoiceAPI.joinVoiceChannel({
                        channelId: Voice_Channel.id,
                        guildId: Message.guild.id,
						adapterCreator: Message.guild.voiceAdapterCreator,
                    });

                    Queue_Constructor.Connection = Connection;
                    Video_Player(Message.guild, Queue_Constructor.Songs[0]);
                } catch (Error) {
                    Song_Queues.delete(Message.guild.id);
                    Message.channel.send({embeds: [Ambulance_Embed("Sorry, but I ran into an error.")]});

                    console.log(Error);
                };
            } else {
                Server_Queue.Songs.push(Song);

                return Message.channel.send({embeds: [Queue_Add_Embed(Song, Message.author.tag)]});
            }
        } else if (Command === "skip") {
            if (!Server_Queue) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, there is no songs in the queue.`)]});

            Server_Queue.Songs.shift();
            Video_Player(Guild, Server_Queue.Songs[0]);
        } else if (Command === "stop") {
            Message.channel.send(Stop_Embed(Server_Queue.Songs[0], Message.author.tag));
            Server_Queue.Voice_Channel.leave();
            Song_Queues.delete(Guild.id);
        } else if (Command === "currentsong") {
            if (!Server_Queue) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, there is no songs in the queue.`)]});
            if (!Server_Queue.Songs[0]) return Message.channel.send({embeds: [Ambulance_Embed(`${Message.author.toString()}, there is no song playing.`)]});

            Message.channel.send(Current_Song_Embed(Server_Queue[0]));
        };
    }
};