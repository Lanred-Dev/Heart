const Pepes = {
    dance: "https://tenor.com/view/frog-memes-dank-funny-pepe-the-frog-gif-15299640",
    bonk: "https://tenor.com/view/anime-pepe-the-frog-hammer-smash-meme-gif-12409029",
    hacker: "https://tenor.com/view/anonymous-anonymous-bites-back-geek-pepe-pepe-matrix-gif-14778477",
    jam: "https://tenor.com/view/pepe-pepe-the-frog-listening-to-music-dance-grooving-gif-16927052",
    love: "https://tenor.com/view/pepe-the-frog-pepe-hearts-love-sending-love-gif-17602490",
    gun: "https://tenor.com/view/pepe-pepe-the-frog-gun-shooting-sweating-gif-17809200",
    reeee: "https://tenor.com/view/rage-gun-frog-reeee-pepe-gif-17082141",
    re: "https://tenor.com/view/rage-gun-frog-reeee-pepe-gif-17082141",
    ree: "https://tenor.com/view/rage-gun-frog-reeee-pepe-gif-17082141",
    wildwest: "https://tenor.com/view/pepe-the-frog-pepe-shooting-gun-gif-17813085",
    hypers: "https://tenor.com/view/fortnite-pepe-the-frog-dancing-gif-17857141"
};
const Get_Tip = Global_Functions.Get_Tip;

module.exports = {
    name: "pepe",
    aliases: ["pepe", "frogman", "frogguy"],
    category: "fun",
    setup: "pepe [Pepe Name]",
    show_aliases: true,
    secondary: ["pepe dance", "pepe bonk", "pepe hacker", "pepe jam", "pepe love", "pepe gun", "pepe reeee", "pepe wildwest"],
    description: "Pepe the frog! yk what I mean?",

    async execute(Message, Message_Args, Client) {
        const Pepe = Message_Args.slice(0).join(" ").toLowerCase() || Pepes[0];

        Message.channel.send(Get_Tip(), {
            embeds: [Pepes[Pepe]]
        });
    }
};