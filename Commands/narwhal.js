const Narwhals = [
    "https://tenor.com/view/narwhal-ocean-arctic-whale-tusk-gif-3383412",
    "https://tenor.com/view/narwhal-evil-geno-turn-around-gif-15076424",
    "https://tenor.com/view/narwhal-gif-6033047",
    "https://tenor.com/view/elf-bye-buddy-christmas-gif-10601643"
];

module.exports = {
    name: "narwhal",
    aliases: ["patnarwhal"],
    category: "fun",
    setup: "narwhal",
    show_aliases: true,
    description: "hello mr. narwhal :wave:",

    async execute(Message, Message_Args, Client) {
        Message.channel.send(Narwhals[Math.floor(Math.random() * Narwhals.length)]);
    }
};