const Discord = require("discord.js");
const Discord_Voice = require("@discordjs/voice");
const play_dl = require("play-dl");
const { promisify } = require("node:util");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Global_Queue = new Map();
const Ambulance_Embed = Global_Functions.Ambulance_Embed;
const Format_Time = Global_Functions.Format_Time;
const Error_Embed = Global_Functions.Error_Embed;
const Spotify_Client_ID = process.env.SPOTIFY_CLIENT_ID;
const Spotify_Secret = process.env.SPOTIFY_SECRET;
const Spotify_Refresh_Token = process.env.SPOTIFY_REFRESH_TOKEN;
const Custom_Wait = promisify(setTimeout);

function Substring(Length, Value) {
    return Value.replace(/\n/g, "--")
        .match(new RegExp(`.{1,${Length}}`, "g"))
        .map((Line) => Line.replace(/--/g, "\n"));
}

function New_Song_Embed(Title, Description, URL, Duration, Thumbnail, User) {
    const Embed = new Discord.MessageEmbed()
        .setColor(Global_Embed_Color)
        .setTitle(`:headphones: A new song is playing :headphones:`)
        .setThumbnail(Thumbnail)
        .setDescription(`[${Title}](${URL})\n\n${Description}`)
        .setFooter(`❤ Requested by ${User} • ${Format_Time(Duration)}`);

    return Embed;
}

function Queue_Add_Embed(Title, Description, URL, Duration, Thumbnail, User, Position_In_Queue) {
    const Embed = new Discord.MessageEmbed()
        .setColor(Global_Embed_Color)
        .setTitle(`:headphones: A song has been added to the queue :headphones:`)
        .setThumbnail(Thumbnail)
        .setDescription(`[${Title}](${URL})\n\n${Description}`)
        .setFooter(`❤ Requested by ${User} • ${Format_Time(Duration)} long • #${Position_In_Queue} in queue`);

    return Embed;
}

function Current_Song_Embed(Title, Description, URL, Duration, Thumbnail, User) {
    const Embed = new Discord.MessageEmbed()
        .setColor(Global_Embed_Color)
        .setTitle(`:headphones: Whats the current jam? :headphones:`)
        .setThumbnail(Thumbnail)
        .setDescription(`[${Title}](${URL})\n\n${Description}`)
        .setFooter(`❤ Requested by ${User} • ${Format_Time(Duration)} remaining`);

    return Embed;
}

function Pause_Embed(Song, Time_Left, User) {
    const Embed = new Discord.MessageEmbed()
        .setColor(Global_Embed_Color)
        .setTitle(`:headphones: Songs have been paused! :headphones:`)
        .setFooter(`❤ Paused by ${User} • ${Format_Time(Time_Left)} left on ${Song}`);

    return Embed;
}

function Resume_Embed(Song, Time_Left, User) {
    const Embed = new Discord.MessageEmbed()
        .setColor(Global_Embed_Color)
        .setTitle(`:headphones: Songs are resumed! :headphones:`)
        .setFooter(`❤ Resumed by ${User} • Resuming ${Song} with ${Format_Time(Time_Left)} left`);

    return Embed;
}

function Queue_Embed(Queue, Current_Page, Page_Amount) {
    const Embed = new Discord.MessageEmbed().setColor(Global_Embed_Color).setTitle(`:headphones: Whats in the queue today? :headphones:`).setDescription(Queue).setFooter(`❤ Page ${Current_Page}/${Page_Amount}`);

    return Embed;
}

function Get_Queue(Queue, Start, End) {
    let String = null;

    Queue.forEach((Song, Index) => {
        if (Index + 1 >= Start && Index + 1 < End) {
            String = `${String ? `${String}\n\n` : ""}**${Index + 1 + (Index === 0 ? " (Playing)" : "")}**. [${Song.title}](${Song.url})\nRequested by ${Song.user}\n${Format_Time(Song.duration * 1000)} long`;
        }
    });

    return String;
}

async function Core_Audio_Player(Server_Queue, Song) {
    try {
        if (!Song || !Server_Queue) return;

        const Audio_Stream = await play_dl.stream(Song.url);
        const Audio_Resource = Discord_Voice.createAudioResource(Audio_Stream.stream, {
            inputType: Audio_Stream.type,
        });

        Song.started = new Date();
        Server_Queue.Audio_Player.play(Audio_Resource);
        Server_Queue.Text_Channel.send({ embeds: [New_Song_Embed(Song.title, Song.description, Song.url, Song.duration * 1000, Song.thumbnail, Song.user.tag)] });
    } catch (Error) {
        console.log(`Failed to run song command Core_Audio_Player.\nError: ${Error}`);

        Server_Queue.Text_Channel.send({ embeds: [Error_Embed(Error)] });
    }
}

play_dl.setToken({
    spotify: {
        client_id: Spotify_Client_ID,
        client_secret: Spotify_Secret,
        refresh_token: Spotify_Refresh_Token,
        market: "US",
    },
});

module.exports = {
    name: "song",
    aliases: ["play", "stop", "skip", "currentsong", "queue", "clearqueue", "pause", "resume"],
    category: "music",
    show_aliases: false,
    setup: "help song",
    secondary: ["play [Name/Link]", "skip", "stop", "leave", "currentsong", "queue [Page]", "clearqueue", "pause", "resume"],
    description: "Want to listen to some audio in a vc, otherwise known as a voice call? Well this is how!",

    async execute(Message, Message_Args, Client, Command) {
        try {
            if (play_dl.is_expired()) {
                await play_dl.refreshToken();
            }

            const Voice_Channel = Message.member.voice?.channel;
            let Server_Queue = Global_Queue.get(Message.guild.id);

            if ((!Server_Queue || Server_Queue.Queue.length <= 0 || (Server_Queue.Paused === true && Command != "resume")) && Command != "play" && Command != "song") return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, no song is playing${Server_Queue ? (Server_Queue.Paused === true ? "(queue is paused)" : "") : ""}.`)] });

            if (!Voice_Channel)
                return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, you have to be in a voice channel.`)],
                });
                
            if (Server_Queue && Server_Queue.Voice_Channel != Voice_Channel && Server_Queue.Voice_Channel.members.filter((Member) => Member.bot === true).size >= 1) {
                return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, you have to be in **${Server_Queue.Voice_Channel.name}** to add items to the queue.`)],
                });
            } else if (Server_Queue && Server_Queue.Voice_Channel != Voice_Channel && Server_Queue.Voice_Channel.members.filter((Member) => Member.bot === true).size === 0) {
                const Channel_Connection = Discord_Voice.joinVoiceChannel({
                    channelId: Voice_Channel.id,
                    guildId: Message.guild.id,
                    adapterCreator: Message.guild.voiceAdapterCreator,
                });

                Server_Queue.Voice_Channel = Voice_Channel;
                Server_Queue.Channel_Connection = Channel_Connection;
                Channel_Connection.subscribe(Server_Queue.Audio_Player);
            }

            const Has_Permissions = Voice_Channel.permissionsFor(Client.user).has([Discord.Permissions.FLAGS["SPEAK"], Discord.Permissions.FLAGS["CONNECT"]]);

            if (!Has_Permissions)
                return Message.channel.send({
                    embeds: [Ambulance_Embed(`${Message.author.toString()}, I dont have access to **${Voice_Channel.name}**.`)],
                });

            const Current_Song = Server_Queue?.Queue[0];

            if (Command === "play" || Command === "song") {
                const Requested_Song = Message_Args.slice(0).join(" ");

                if (!Requested_Song) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a song.`)] });

                const Validation = await play_dl.validate(Requested_Song);
                let Song = null;

                if (Validation && Validation != "search") {
                    if (Validation != "yt_video" && Validation != "sp_track")
                        return Message.channel.send({
                            embeds: [Ambulance_Embed(`${Message.author.toString()}, provide a valid track(or video) url.`)],
                        });

                    if (Validation === "sp_track") {
                        let Spotify_Data = await play_dl.spotify(Requested_Song);
                        let Artists = "";

                        Spotify_Data.artists.forEach((Artist, Index) => {
                            Artists = `${Artists}[${Artist.name}](${Artist.url})${Index + 1 === Spotify_Data.artists.length ? "" : ", "}`;
                        });

                        Spotify_Data.description = `Artists: ${Artists}\nAlbumn: [${Spotify_Data.album.name}](${Spotify_Data.album.url})`;

                        const Search = await play_dl.search(Spotify_Data.name, { limit: 1, source: { youtube: "video" } });

                        if (!Search) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, I was unable to find a track(or video) called **${Requested_Song}**.`)] });

                        Song = Search[0];
                        Song.description = Spotify_Data.description;
                        Song.is_spotify = true;
                    } else if (Validation === "yt_video") {
                        Song = await (await play_dl.video_basic_info(Requested_Song)).video_details;
                    }
                } else {
                    const Search = await play_dl.search(Requested_Song, { limit: 1, source: { youtube: "video" } });

                    if (!Search) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, I was unable to find a track(or video) called **${Requested_Song}**.`)] });

                    Song = Search[0];
                }

                if (!Song) return;

                if (!Server_Queue) {
                    const Channel_Connection = Discord_Voice.joinVoiceChannel({
                        channelId: Voice_Channel.id,
                        guildId: Message.guild.id,
                        adapterCreator: Message.guild.voiceAdapterCreator,
                    });
                    const Audio_Player = Discord_Voice.createAudioPlayer({
                        behaviors: {
                            noSubscriber: Discord_Voice.NoSubscriberBehavior.Pause,
                        },
                    });
                    const Constructor = {
                        Guild_ID: Message.guild.id,
                        Voice_Channel: Voice_Channel,
                        Text_Channel: Message.channel,
                        Channel_Connection: Channel_Connection,
                        Audio_Player: Audio_Player,
                        Paused: false,
                        Queue: [
                            {
                                url: Song.url,
                                title: Song.title,
                                description: Song.is_spotify === null ? Substring(500, Song.description)[0] : Song.description,
                                thumbnail: Song.thumbnail.url,
                                duration: Song.durationInSec,
                                user: Message.author,
                                started: null,
                            },
                        ],
                    };

                    Global_Queue.set(Message.guild.id, Constructor);
                    Server_Queue = Global_Queue.get(Message.guild.id);
                    Channel_Connection.subscribe(Audio_Player);

                    Channel_Connection.on(Discord_Voice.VoiceConnectionStatus.Ready, () => {
                        Core_Audio_Player(Server_Queue, Server_Queue.Queue[0]);
                    });

                    Channel_Connection.on("stateChange", async (_, New_State) => {
                        if (New_State.status === Discord_Voice.VoiceConnectionStatus.Disconnected) {
                            if (New_State.reason === Discord_Voice.VoiceConnectionDisconnectReason.WebSocketClose && New_State.closeCode === 4014) {
                                try {
                                    await Discord_Voice.entersState(Channel_Connection, Discord_Voice.VoiceConnectionStatus.Connecting, 5_000);
                                } catch {
                                    Channel_Connection.destroy();
                                    Global_Queue.delete(Server_Queue.Guild_ID);
                                }
                            } else if (Channel_Connection.rejoinAttempts < 5) {
                                await Custom_Wait((Channel_Connection.rejoinAttempts + 1) * 5_000);
                                Channel_Connection.rejoin();
                            } else {
                                Channel_Connection.destroy();
                                Global_Queue.delete(Server_Queue.Guild_ID);
                            }
                        } else if (New_State.status === Discord_Voice.VoiceConnectionStatus.Destroyed) {
                            Audio_Player.stop();
                            Global_Queue.delete(Server_Queue.Guild_ID);
                        } else if (New_State.status === Discord_Voice.VoiceConnectionStatus.Connecting || New_State.status === Discord_Voice.VoiceConnectionStatus.Signalling) {
                            try {
                                await Discord_Voice.entersState(Channel_Connection, Discord_Voice.VoiceConnectionStatus.Ready, 20_000);
                            } catch {
                                if (Channel_Connection.state.status !== VoiceConnectionStatus.Destroyed) Channel_Connection.destroy();
                            }
                        }
                    });

                    Audio_Player.on("stateChange", (Old_State, New_State) => {
                        if (New_State.status === Discord_Voice.AudioPlayerStatus.Idle && Old_State.status != Discord_Voice.AudioPlayerStatus.Idle && Server_Queue.Queue.length > 1) {
                            Server_Queue.Queue.shift();
                            Core_Audio_Player(Server_Queue, Server_Queue.Queue[0]);
                        }
                    });
                } else {
                    Server_Queue.Queue.push({
                        url: Song.url,
                        title: Song.title,
                        description: Song.is_spotify === null ? Substring(500, Song.description)[0] : Song.description,
                        thumbnail: Song.thumbnail.url,
                        duration: Song.durationInSec,
                        user: Message.author,
                        started: null,
                    });

                    Server_Queue.Text_Channel.send({ embeds: [Queue_Add_Embed(Song.title, Song.is_spotify === null ? Substring(500, Song.description)[0] : Song.description, Song.url, Song.durationInSec * 1000, Song.thumbnail.url, Message.author.tag, Server_Queue.Queue.length + 1)] });
                }
            } else if (Command === "currentsong") {
                Message.channel.send({ embeds: [Current_Song_Embed(Current_Song.title, Current_Song.description, Current_Song.url, Current_Song.duration * 1000 - Math.abs(new Date().getTime() - Current_Song.started.getTime()), Current_Song.thumbnail, Current_Song.user.tag)] });
            } else if (Command === "pause") {
                Server_Queue.Audio_Player.pause();
                Server_Queue.Queue[0].duration = (Current_Song.duration * 1000 - Math.abs(new Date().getTime() - Current_Song.started.getTime())) / 1000;
                Server_Queue.Paused = true;

                Message.channel.send({ embeds: [Pause_Embed(Current_Song.title, Server_Queue.Queue[0].duration * 1000, Message.author.tag)] });
            } else if (Command === "resume") {
                Server_Queue.Audio_Player.unpause();
                Server_Queue.Queue[0].started = new Date();
                Server_Queue.Paused = false;

                Message.channel.send({ embeds: [Resume_Embed(Current_Song.title, Server_Queue.Queue[0].duration * 1000, Message.author.tag)] });
            } else if (Command === "skip") {
                if (Server_Queue.Queue.length <= 0) return Message.channel.send({ embeds: [Ambulance_Embed(`${Message.author.toString()}, there are no songs in the queue.`)] });

                Server_Queue.Queue.shift();
                Core_Audio_Player(Server_Queue, Server_Queue.Queue[0]);
            } else if (Command === "queue") {
                let Requested_Page = Message_Args[0] && parseInt(Message_Args[0]) ? parseInt(Message_Args[0]) : Message_Args[0] && Message_Args[0].toLowerCase() == "page" && parseInt(Message_Args[1]) ? parseInt(Message_Args[1]) : 1;

                if (Requested_Page < 0 || (Requested_Page > 1 && 5 * Requested_Page - 5 > Server_Queue.Queue.length)) Requested_Page = 1;

                Message.channel.send({ embeds: [Queue_Embed(Get_Queue(Server_Queue.Queue, Requested_Page > 1 ? 5 * Requested_Page - 4 : 1, Requested_Page === 1 ? 5 * Requested_Page + 1 : 5 * Requested_Page + 1), Requested_Page, Math.floor(Server_Queue.Queue.length / 5 + (Server_Queue.Queue.length % 5 === 0 ? 0 : 1)))] });
            }
        } catch (Error) {
            console.log(`Failed to run song command.\nError: ${Error}`);

            Message.channel.send({ embeds: [Error_Embed(Error)] });
        }
    },
};
